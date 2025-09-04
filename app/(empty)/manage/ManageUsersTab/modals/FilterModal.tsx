import { Button } from "@/app/components/core/Button";
import Checkbox from "@/app/components/core/Checkbox";
import { Select } from "@/app/components/core/Select";
import { SelectItem } from "@/app/components/core/SelectItem";
import Tabs from "@/app/components/core/Tabs";
import type { Topsoccer } from "@/types";
import { TIMEZONE } from "@/utils/constants";
import {
  CheckboxGroup,
  DateRangePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  Tab,
} from "@heroui/react";
import {
  type CalendarDate,
  fromDate,
  parseDate,
  toCalendarDate,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { useEffect, useState } from "react";

export default function FilterModal({
  stadiums,
  setFilters,
  ...rest
}: {
  stadiums: Topsoccer.Stadium.FullStadium[];
  setFilters: (data: {
    filter: string | null;
    stadium_id: string | null;
    start_date: string | null;
    end_date: string | null;
  }) => void;
} & Omit<ModalProps, "children">) {
  const [filterTab, setFilterTab] = useState("general");

  const [role, setRole] = useState(["user", "worker", "admin"]);
  const [canPayCash, setCanPayCash] = useState(["true", "false"]);
  const [blocked, setBlocked] = useState(["true", "false"]);
  const [insuranceStatement, setInsuranceStatement] = useState([
    "true",
    "false",
  ]);

  const [useLastSeen, setUseLastSeen] = useState(false);
  const [lastSeen, setLastSeen] = useState("year");

  // const [useEventTypes, setUseEventTypes] = useState(false);
  // const [eventTypes, setEventTypes] = useState(EVENT_TYPES);

  const [stadium, setStadium] = useState<Topsoccer.Stadium.FullStadium | null>(
    null,
  );
  const [stadiumTypeFilterSelected, setStadiumTypeFilterSelected] =
    useState(false);
  const [stadiumTimeFilterType, setStadiumTimeFilterType] = useState<
    "last_month" | "last_three_months" | "last_year" | "custom"
  >("last_month");
  const [dateRange, setDateRange] = useState<{
    start: CalendarDate;
    end: CalendarDate;
  } | null>(null);

  useEffect(() => {
    if (!stadiumTypeFilterSelected || stadiumTimeFilterType === "custom") {
      setDateRange(null);
    } else {
      const maxDate = new Date();
      let minDate = new Date();
      if (stadiumTimeFilterType === "last_month") {
        minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
      } else if (stadiumTimeFilterType === "last_three_months") {
        minDate = new Date(maxDate.getFullYear(), maxDate.getMonth() - 3, 1);
      } else if (stadiumTimeFilterType === "last_year") {
        minDate = new Date(maxDate.getFullYear(), 0, 1);
      }

      setDateRange({
        start: toCalendarDate(fromDate(minDate, TIMEZONE)),
        end: toCalendarDate(fromDate(maxDate, TIMEZONE)),
      });
    }
  }, [stadiumTimeFilterType, stadiumTypeFilterSelected]);

  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>מסננים</ModalHeader>
            <ModalBody>
              <Tabs
                classNames={{ panel: "pt-2" }}
                selectedKey={filterTab}
                onSelectionChange={(key) => setFilterTab(key as string)}
              >
                <Tab key="general" title="כללי">
                  <div className="flex flex-col gap-4 px-4">
                    <div className="flex justify-between border-b border-b-theme-light-gray pb-4">
                      <CheckboxGroup
                        label="הרשאות"
                        value={role}
                        onValueChange={(value) => {
                          if (value.length > 0) setRole(value);
                        }}
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <Checkbox value={option.key} key={option.key}>
                            {option.label}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                      <CheckboxGroup
                        label="תשלום מזומן"
                        value={canPayCash}
                        onValueChange={(value) => {
                          if (value.length > 0) setCanPayCash(value);
                        }}
                      >
                        {CASH_OPTIONS.map((option) => (
                          <Checkbox value={option.key} key={option.key}>
                            {option.label}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                      <CheckboxGroup
                        label="חסום"
                        value={blocked}
                        onValueChange={(value) => {
                          if (value.length > 0) setBlocked(value);
                        }}
                      >
                        {BLOCKED_OPTIONS.map((option) => (
                          <Checkbox value={option.key} key={option.key}>
                            {option.label}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>
                    <div className="flex justify-between border-b border-b-theme-light-gray pb-4">
                      <CheckboxGroup
                        label="הצהרת ביטוח"
                        value={insuranceStatement}
                        onValueChange={(value) => {
                          if (value.length > 0) setInsuranceStatement(value);
                        }}
                      >
                        {INSURANCE_OPTIONS.map((option) => (
                          <Checkbox value={option.key} key={option.key}>
                            {option.label}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>
                    <div className="flex gap-1 pb-4">
                      <Checkbox
                        isSelected={useLastSeen}
                        onValueChange={setUseLastSeen}
                      />
                      <Select
                        label="נראה לאחרונה"
                        selectedKeys={[lastSeen]}
                        onChange={(e) => setLastSeen(e.target.value)}
                        items={LAST_SEEN_OPTIONS}
                        variant="bordered"
                        isDisabled={!useLastSeen}
                      >
                        {(item: any) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                        )}
                      </Select>
                    </div>
                    {/* <div className="flex gap-1">
                      <Checkbox
                        isSelected={useEventTypes}
                        onValueChange={setUseEventTypes}
                      />
                      <Select
                        className="min-w-0"
                        label="משחק ב:"
                        selectedKeys={eventTypes}
                        onChange={({ target: { value } }) => {
                          const values = value
                            .split(",")
                            .filter((i) => i !== "");
                          if (values.length > 0) setEventTypes(values as any[]);
                        }}
                        items={EVENT_TYPE_OPTIONS}
                        variant="bordered"
                        selectionMode="multiple"
                        isDisabled={!useEventTypes}
                      >
                        {(item: any) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                        )}
                      </Select>
                    </div> */}
                  </div>
                </Tab>
                <Tab key="stadium" title="מגרשים">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span>שיחק ב:</span>
                      <Select
                        aria-label="Stadium Select"
                        selectedKeys={stadium?.id ? [stadium.id] : []}
                        className="flex-1"
                        onChange={(e) => {
                          const id = e.target.value;
                          const stadium = stadiums.find(
                            (stadium) => stadium.id === id,
                          );

                          setStadium(stadium || null);
                        }}
                        items={stadiums.map((s) => ({
                          key: s.id,
                          label: s.name,
                        }))}
                      >
                        {(item: any) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                        )}
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        isSelected={stadiumTypeFilterSelected}
                        onValueChange={setStadiumTypeFilterSelected}
                        isDisabled={stadium === null}
                      />
                      <Select
                        aria-label="Time Select"
                        selectedKeys={[stadiumTimeFilterType]}
                        onChange={(e) => {
                          setStadiumTimeFilterType(e.target.value as any);
                        }}
                        isDisabled={
                          stadium === null || !stadiumTypeFilterSelected
                        }
                      >
                        <SelectItem key="last_month">בחודש האחרון</SelectItem>
                        <SelectItem key="last_three_months">
                          בשלושה חודשים האחרונים
                        </SelectItem>
                        <SelectItem key="last_year">בשנה האחרונה</SelectItem>
                        <SelectItem key="custom">זמן מותאם אישי</SelectItem>
                      </Select>
                    </div>
                    <I18nProvider locale="he-IL">
                      <DateRangePicker
                        granularity="day"
                        classNames={{
                          inputWrapper: "border border-theme-light-gray",
                        }}
                        value={dateRange as any}
                        onChange={(range) => {
                          if (!range) {
                            setDateRange(null);
                            return;
                          }

                          setDateRange({
                            start: parseDate(
                              (range.start as any as CalendarDate).toString(),
                            ),
                            end: parseDate(
                              (range.end as any as CalendarDate).toString(),
                            ),
                          });
                        }}
                        maxValue={toCalendarDate(
                          fromDate(new Date(), TIMEZONE),
                        )}
                        isDisabled={
                          stadiumTimeFilterType !== "custom" ||
                          !stadiumTypeFilterSelected
                        }
                      />
                    </I18nProvider>
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                סגור
              </Button>
              <Button color="primary" onPress={submitFilters}>
                שמור
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  function submitFilters() {
    let filter = "true";

    filter += sql_query(role, "role");
    filter += sql_query(canPayCash, "can_pay_cash");
    filter += sql_query(blocked, "blocked");
    filter += sql_query(insuranceStatement, "insurance_statement");

    if (useLastSeen) {
      filter += " and (";

      switch (lastSeen) {
        case "today":
          filter += "last_seen::date = now()::date";
          break;
        case "yesterday":
          filter += "last_seen::date = current_date - interval '1 day'";
          break;
        case "week":
          filter += `last_seen::date >= current_date - date_part('dow', current_date)::int`;
          break;
        case "month":
          filter += `last_seen::date >= date_trunc('month', current_date)::date`;
          break;
        case "year":
          filter += `last_seen::date >= date_trunc('year', current_date)::date`;
          break;
        case "more_than_year":
          filter += `last_seen::date < date_trunc('year', current_date)::date or last_seen is null`;
          break;
      }

      filter += ")";
    }

    // if (useEventTypes) {
    //   filter += " and (";

    //   eventTypes.forEach((type, i) => {
    //     filter += `'${type}' = any(event_types)`;
    //     if (i < eventTypes.length - 1) filter += " or ";
    //   });

    //   filter += ")";
    // }

    setFilters({
      filter,
      stadium_id: stadium ? stadium.id : null,
      start_date: dateRange ? dateRange.start.toString() : null,
      end_date: dateRange ? dateRange.end.toString() : null,
    });
  }
}

function sql_query<T>(options: T[], field: string) {
  let query = "";

  if (options.length > 0) {
    query += " and (";
    options.forEach((o, i) => {
      const value = (() => {
        if (typeof o === "string") return `'${o}'`;
        return `${o}`;
      })();

      query += `${field} = ${value}`;
      if (i < options.length - 1) query += " or ";
    });
    query += ")";
  }

  return query;
}

const ROLE_OPTIONS = [
  { key: "user", label: "משתמש" },
  { key: "worker", label: "עובד" },
  { key: "admin", label: "אדמין" },
];

const CASH_OPTIONS = [
  { key: "true", label: "כן" },
  { key: "false", label: "לא" },
];

const BLOCKED_OPTIONS = [
  { key: "true", label: "כן" },
  { key: "false", label: "לא" },
];

const INSURANCE_OPTIONS = [
  { key: "true", label: "יש" },
  { key: "false", label: "אין" },
];

const LAST_SEEN_OPTIONS = [
  { key: "today", label: "היום" },
  { key: "yesterday", label: "אתמול" },
  { key: "week", label: "השבוע" },
  { key: "month", label: "החודש" },
  { key: "year", label: "השנה" },
  { key: "more_than_year", label: "מעל שנה" },
];

// const EVENT_TYPE_OPTIONS = EVENT_TYPES.map((type) => ({
//   key: type,
//   label: type,
// }));
