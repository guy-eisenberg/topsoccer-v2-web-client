"use client";

import ExcelIcon from "@/app/components/common/icons/ExcelIcon";
import GoogleIcon from "@/app/components/common/icons/GoogleIcon";
import { showLoading } from "@/app/components/common/Loader/Loader";
import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { Button } from "@/app/components/core/Button";
import Dropdown from "@/app/components/core/Dropdown";
import Input from "@/app/components/core/Input";
import { Select } from "@/app/components/core/Select";
import { SelectItem } from "@/app/components/core/SelectItem";
import { createClient } from "@/clients/supabase/client";
import useAsyncList from "@/hooks/useAsyncList";
import { useMounted } from "@/hooks/useMounted";
import { getRoleLabel } from "@/utils/getRoleLabel";
import { prefix } from "@/utils/prefix";
import { splitDate } from "@/utils/splitDate";
import toast from "@/utils/toast";
import { DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import { Button as _Button } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { IconCheck, IconDots, IconFilter, IconMail } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import { utils, writeFile } from "xlsx";
import type { Topsoccer } from "../../../../types";
import ChangeNameModal from "./modals/ChangeNameModal";
import DeleteUserModal from "./modals/DeleteUserModal";
import ExportExcelModal from "./modals/ExportExcelModal";
import FilterModal from "./modals/FilterModal";
import UpdateUserWalletModal from "./modals/SetUserWalletModal";

const supabase = createClient();

interface GetUserResult {
  id: string;
  created_at: string;
  display_name: string;
  email: string;
  photo_url: string;
  last_seen: string;
  tz_id: string;
  birth_date: string;
  city: string;
  phone_number: string;
  insurance_statement: string;
  can_pay_cash: boolean;
  role: Topsoccer.User.Role;
  blocked: boolean;
  wallet: number;
  provider: string;
  event_types: Topsoccer.Event.Type[];
  row_number: number;
  pool_size: number;
}

const PAGE_SIZE = 30;

const ManageUsersTab: React.FC<{
  stadiums: Topsoccer.Stadium.FullStadium[];
}> = ({ stadiums }) => {
  const mounted = useMounted();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [changeNameModalOpen, setChangeNameModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [updateUserWalletModalOpen, setUpdateUserWalletModalOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] = useState<GetUserResult>();
  const [poolSize, setPoolSize] = useState(0);

  const {
    items: users,
    isLoading: usersLoading,
    filterText: usersQuery,
    setFilterText: setUsersQuery,
    page,
    setPage,
    revalidate,
    sort,
    setSort,
    metadata,
    setMetadata,
  } = useAsyncList({
    async fetch({ filterText, sort, page, metadata }) {
      const filter = metadata.filter;
      const stadium_id = metadata.stadium_id;
      const events_min_date = metadata.events_min_date;
      const events_max_date = metadata.events_max_date;

      const { data: users } = (await supabase.rpc("z2_manage_query_users", {
        _term: filterText,
        _filter: filter || null,
        _stadium_id: stadium_id || null,
        _events_min_date: events_min_date || null,
        _events_max_date: events_max_date || null,
        _order_col: sort?.column || null,
        _order_dir: sort?.direction === "ascending" ? "asc" : "desc",
        _page: page,
        _page_size: PAGE_SIZE,
      })) as { data: GetUserResult[] };

      return users;
    },
    debounce: 1000,
  });

  useEffect(() => {
    if (mounted && usersLoading) {
      const hideLoading = showLoading();

      return () => {
        hideLoading();
      };
    }
  }, [mounted, usersLoading]);

  useEffect(() => {
    if (users.length > 0 && !usersLoading) {
      setPoolSize(users[0].pool_size);
    } else {
      setPoolSize(0);
    }
  }, [users, usersLoading]);

  const pageCount = Math.ceil(poolSize / PAGE_SIZE);

  const table = useMemo(() => {
    let index = 1;

    return (
      <Table
        aria-label="Manage Users Table"
        className="flex-1 !border-none"
        classNames={{
          base: "min-h-0",
          wrapper: "flex-1",
        }}
        bottomContent={
          pageCount > 1 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                color="primary"
                total={pageCount}
                page={page + 1}
                onChange={(page) => setPage(page - 1)}
              />
            </div>
          )
        }
        sortDescriptor={sort || undefined}
        onSortChange={setSort}
        isStriped
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn align="center">#</TableColumn>
          <TableColumn key="display_name" allowsSorting>
            שם מלא
          </TableColumn>
          <TableColumn key="tz_id" align="center" allowsSorting>
            ת.ז
          </TableColumn>
          <TableColumn key="phone_number" align="center" allowsSorting>
            טלפון
          </TableColumn>
          <TableColumn key="email" align="center" allowsSorting>
            אימייל
          </TableColumn>
          <TableColumn key="city" align="center" allowsSorting>
            עיר
          </TableColumn>
          <TableColumn key="created_at" align="center" allowsSorting>
            תאריך הצטרפות
          </TableColumn>
          <TableColumn key="last_seen" align="center" allowsSorting>
            נראה לאחרונה
          </TableColumn>
          <TableColumn key="insurance_statement" align="center">
            הצהרת ביטוח
          </TableColumn>
          <TableColumn key="wallet" align="center">
            ניקובים
          </TableColumn>
          <TableColumn key="role" align="center">
            הרשאות
          </TableColumn>
          <TableColumn key="can_pay_cash" align="center">
            תשלום מזומן
          </TableColumn>
          <TableColumn key="blocked" align="center">
            חסום
          </TableColumn>
          <TableColumn key="actions" align="center">
            פעולות ומידע
          </TableColumn>
        </TableHeader>
        <TableBody items={users}>
          {(user) => {
            const {
              day: create_day,
              month: create_month,
              year: create_year,
            } = splitDate(new Date(user.created_at));

            const {
              day: seen_day,
              month: seen_month,
              year: seen_year,
            } = splitDate(new Date(user.last_seen || 0));

            const actions = [
              <DropdownItem
                href={`/player-events/${user.id}`}
                key="events-list-action"
              >
                רשימת אירועים
              </DropdownItem>,
              <DropdownItem
                onPress={() => {
                  setSelectedUser(user);
                  setChangeNameModalOpen(true);
                }}
                key="change-name-action"
              >
                שנה שם
              </DropdownItem>,
              <DropdownItem
                onPress={() => {
                  setSelectedUser(user);
                  setUpdateUserWalletModalOpen(true);
                }}
                key="update-wallet-action"
              >
                יתרת ניקובים
              </DropdownItem>,
            ];
            if (user.phone_number)
              actions.push(
                <DropdownItem
                  onPress={() => {
                    window.open(
                      `https://web.whatsapp.com/send?phone=972${user.phone_number}`,
                      "_blank",
                    );
                  }}
                  key="send-whatsapp-action"
                >
                  שלח הודעת ווטסאפ
                </DropdownItem>,
              );
            actions.push(
              <DropdownItem
                className="text-danger"
                color="danger"
                onPress={() => {
                  setSelectedUser(user);
                  setDeleteUserModalOpen(true);
                }}
                key="delete-user-action"
              >
                מחק משתמש
              </DropdownItem>,
            );

            return (
              <TableRow key={user.id}>
                <TableCell>{page * PAGE_SIZE + index++}</TableCell>
                <TableCell textValue={user.display_name}>
                  <div className="flex items-center gap-2">
                    {user.provider === "google" ? (
                      <GoogleIcon className="h-4 w-4 shrink-0" />
                    ) : (
                      <IconMail className="h-4 w-4 shrink-0" />
                    )}
                    <PlayerAvatar
                      className="h-7 w-7 rounded-xl"
                      src={user.photo_url}
                    />
                    <span>{user.display_name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.tz_id}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>
                  {prefix(create_day)}.{prefix(create_month)}.
                  {create_year - 2000}
                </TableCell>
                <TableCell>
                  {user.last_seen
                    ? `${prefix(seen_day)}.${prefix(seen_month)}.${seen_year - 2000}`
                    : "לא ידוע"}
                </TableCell>
                <TableCell>
                  {user.insurance_statement ? (
                    <IconCheck className="mx-auto text-theme-green" />
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>{user.wallet}</TableCell>
                <TableCell textValue={user.role}>
                  <Select
                    aria-label="User role select"
                    className="min-w-24"
                    items={[
                      { key: "user", label: "משתמש" },
                      { key: "worker", label: "עובד" },
                      { key: "admin", label: "אדמין" },
                    ]}
                    selectedKeys={[user.role || "user"]}
                    onChange={({ target: { value: role } }) => {
                      updateRole(user.id, role);
                    }}
                    variant="bordered"
                    size="sm"
                  >
                    {(item: any) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </TableCell>
                <TableCell textValue={user.can_pay_cash ? "true" : "false"}>
                  <Select
                    aria-label="User can pay cash select"
                    className="min-w-24"
                    items={[
                      { key: "true", label: "כן" },
                      { key: "false", label: "לא" },
                    ]}
                    selectedKeys={[user.can_pay_cash ? "true" : "false"]}
                    onChange={({ target: { value: can_pay_cash } }) => {
                      updateCanPayCash(
                        user.id,
                        can_pay_cash === "true" ? true : false,
                      );
                    }}
                    variant="bordered"
                    size="sm"
                  >
                    {(item: any) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </TableCell>
                <TableCell textValue={user.blocked ? "true" : "false"}>
                  <Select
                    aria-label="User blocked select"
                    className="min-w-24"
                    items={[
                      { key: "true", label: "כן" },
                      { key: "false", label: "לא" },
                    ]}
                    selectedKeys={[user.blocked ? "true" : "false"]}
                    onChange={({ target: { value: blocked } }) => {
                      updateBlocked(user.id, blocked === "true" ? true : false);
                    }}
                    variant="bordered"
                    size="sm"
                  >
                    {(item: any) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <_Button variant="bordered" size="sm" isIconOnly>
                        <IconDots className="h-5 w-5" />
                      </_Button>
                    </DropdownTrigger>
                    <DropdownMenu>{actions}</DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSort, sort, users, poolSize, page]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex w-full gap-2">
        <Input
          className="flex-1"
          value={usersQuery}
          onChange={(e) => setUsersQuery(e.target.value)}
          placeholder="חפש לפי שם, אימייל ועוד..."
        />
        <Button
          className="border border-theme-light-gray bg-white hover:border-theme-green dark:bg-default-100 md:w-20"
          onPress={() => setFilterModalOpen(true)}
          isIconOnly
        >
          <IconFilter />
        </Button>
        <Button
          className="border border-theme-light-gray bg-white hover:border-theme-green dark:bg-default-100 md:w-20"
          onPress={() => setExcelModalOpen(true)}
          isIconOnly
        >
          <ExcelIcon className="h-6 w-6" />
        </Button>
      </div>
      {table}

      <FilterModal
        isOpen={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        setFilters={({ filter, stadium_id, start_date, end_date }) => {
          setMetadata({
            ...metadata,
            filter,
            stadium_id,
            events_min_date: start_date,
            events_max_date: end_date,
          });

          setFilterModalOpen(false);
        }}
        stadiums={stadiums}
      />
      <ExportExcelModal
        isOpen={excelModalOpen}
        onOpenChange={setExcelModalOpen}
        submit={exportToExcel}
      />
      {selectedUser && (
        <>
          <ChangeNameModal
            isOpen={changeNameModalOpen}
            onOpenChange={setChangeNameModalOpen}
            initialName={selectedUser?.display_name}
            submit={(name) => {
              if (!selectedUser) return;

              updateUserName(selectedUser.id, name);
            }}
            key={`change-name-modal-${selectedUser.id}`}
          />
          <UpdateUserWalletModal
            initialWallet={selectedUser?.wallet || 0}
            isOpen={updateUserWalletModalOpen}
            onOpenChange={setUpdateUserWalletModalOpen}
            submit={(wallet) => {
              updateUserWallet(selectedUser.id, wallet);
            }}
            key={`update-wallet-modal-${selectedUser.id}`}
          />
          <DeleteUserModal
            isOpen={deleteUserModalOpen}
            onOpenChange={setDeleteUserModalOpen}
            name={selectedUser?.display_name || ""}
            submit={() => {
              if (!selectedUser) return;

              deleteUser(selectedUser.id);
            }}
            key={`delete-user-modal-${selectedUser.id}`}
          />
        </>
      )}
    </div>
  );

  async function exportToExcel(option: string) {
    toast.loading();
    const hideLoading = showLoading();

    try {
      let data: GetUserResult[] = [];

      if (option === "current") data = users;
      else {
        const { data: users } = (await supabase.rpc("z2_manage_query_users", {
          _term: "",
          _filter: null,
          _order_col: null,
          _order_dir: null,
          _page: -1,
        })) as { data: GetUserResult[] };

        data = users;
      }

      const users_data = data.map((user) => {
        const {
          day: create_day,
          month: create_month,
          year: create_year,
        } = splitDate(new Date(user.created_at));

        const {
          day: seen_day,
          month: seen_month,
          year: seen_year,
        } = splitDate(new Date(user.last_seen || 0));
        const role = getRoleLabel(user.role);

        return {
          "שם מלא": user.display_name,
          "תאריך לידה": user.birth_date,
          "ת.ז": user.tz_id,
          טלפון: user.phone_number,
          אימייל: user.email,
          "עיר מגורים": user.city,
          "תאריך הצטרפות": `${create_day}-${create_month}-${create_year}`,
          "נראה לאחרונה": `${seen_day}-${seen_month}-${seen_year}`,
          הרשאות: role,
        };
      });

      const filename = "users.xlsx";

      const ws = utils.json_to_sheet(users_data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Users");
      writeFile(wb, filename);

      toast.success("הורדת הקובץ החלה!");
    } catch (e) {
      console.log(e);

      toast.error();

      return Promise.reject(e);
    } finally {
      hideLoading();
    }
  }

  async function updateBlocked(user_id: string, blocked: boolean) {
    toast.loading("שומר...");
    const hideLoading = showLoading();

    try {
      await supabase
        .from("users_readonly_data")
        .update({ blocked })
        .eq("id", user_id);

      await revalidate();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (e) {
      console.log(e);

      toast.error();

      return Promise.reject(e);
    } finally {
      hideLoading();
    }
  }

  async function updateCanPayCash(user_id: string, can_pay_cash: boolean) {
    toast.loading("שומר...");
    const hideLoading = showLoading();

    try {
      await supabase
        .from("users_readonly_data")
        .update({ can_pay_cash })
        .eq("id", user_id);

      await revalidate();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (e) {
      console.log(e);

      toast.error();

      return Promise.reject(e);
    } finally {
      hideLoading();
    }
  }

  async function updateRole(user_id: string, role: string) {
    toast.loading("שומר...");
    const hideLoading = showLoading();

    try {
      await supabase
        .from("users_readonly_data")
        .update({ role })
        .eq("id", user_id);

      await revalidate();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (e) {
      console.log(e);

      toast.error();

      return Promise.reject(e);
    } finally {
      hideLoading();
    }
  }

  async function updateUserWallet(user_id: string, wallet: number) {
    toast.loading("שומר...");
    const hideLoading = showLoading();

    try {
      await supabase
        .from("users_readonly_data")
        .update({ wallet })
        .eq("id", user_id);

      await revalidate();

      toast.success("יתרה עודכנה בהצלחה!");
    } catch (e) {
      console.log(e);

      toast.error();

      return Promise.reject(e);
    } finally {
      hideLoading();
    }
  }

  async function updateUserName(user_id: string, display_name: string) {
    toast.loading("שומר...");
    const hideLoading = showLoading();

    try {
      await supabase.from("users").update({ display_name }).eq("id", user_id);

      await revalidate();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (e) {
      console.log(e);

      toast.error();

      return Promise.reject(e);
    } finally {
      hideLoading();
    }
  }

  async function deleteUser(user_id: string) {
    toast.loading("שומר...");
    const hideLoading = showLoading();

    try {
      await supabase.rpc("z2_delete_user", { user_id });

      await revalidate();

      toast.success("משתמש נמחק בהצלחה!");
    } catch (e) {
      console.log(e);

      toast.error();

      return Promise.reject(e);
    } finally {
      hideLoading();
    }
  }
};

export default ManageUsersTab;
