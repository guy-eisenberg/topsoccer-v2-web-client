"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { Select } from "@/app/components/core/Select";
import { SelectItem } from "@/app/components/core/SelectItem";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { updateInsuranceStatement as _updateInsuranceStatement } from "./actions";

const options = [
  { key: "false", label: "לא" },
  { key: "true", label: "כן" },
];

export default function InsuranceStatementForm({
  insurance_statement,
}: {
  insurance_statement: Topsoccer.User.InsuranceStatement | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPageUrl = useRef<string | undefined>(undefined);

  const [heartProblems, setHeartProblems] = useState(
    insurance_statement ? insurance_statement.heart_problems.toString() : "",
  );
  const [exerciseDifficulty, setExerciseDifficulty] = useState(
    insurance_statement
      ? insurance_statement.exercise_difficulty.toString()
      : "",
  );
  const [lungProblems, setLungProblems] = useState(
    insurance_statement ? insurance_statement.lung_problems.toString() : "",
  );
  const [diabetes, setDiabetes] = useState(
    insurance_statement ? insurance_statement.diabetes.toString() : "",
  );
  const [epilepsy, setEpilepsy] = useState(
    insurance_statement ? insurance_statement.epilepsy.toString() : "",
  );
  const [otherIssues, setOtherIssues] = useState(
    insurance_statement ? insurance_statement.other_issues.toString() : "",
  );

  const [fullName, setFullname] = useState(
    insurance_statement ? insurance_statement.full_name : "",
  );
  const [tzId, setTzId] = useState(
    insurance_statement ? insurance_statement.tz_id : "",
  );

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "data-missing") {
      toast.warning("יש למלא הצהרת ביטוח.");

      const next = searchParams.get("next");
      if (next) nextPageUrl.current = decodeURIComponent(next);
    }
  }, [searchParams]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        updateInsuranceStatement();
      }}
    >
      <div className="mb-6 space-y-4">
        <p className="text-xl font-semibold">האם הנך סובל או סבלת בעבר מ-?</p>
        <div className="flex items-center gap-2">
          <p>בעיות בלב / כאבים בחזה / שב&quot;ץ</p>
          <Select
            name="heart_problems"
            className="max-w-24"
            selectedKeys={[heartProblems]}
            onChange={(e) => setHeartProblems(e.target.value)}
            items={options}
            disallowEmptySelection
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <p>קושי בזמן פעילות גופנית</p>
          <Select
            name="exercise_difficulty"
            className="max-w-24"
            selectedKeys={[exerciseDifficulty]}
            onChange={(e) => setExerciseDifficulty(e.target.value)}
            items={options}
            disallowEmptySelection
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <p className="light:">מחלות ריאה או קשיי נשימה</p>
          <Select
            name="lung_problems"
            className="max-w-24"
            selectedKeys={[lungProblems]}
            onChange={(e) => setLungProblems(e.target.value)}
            items={options}
            disallowEmptySelection
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <p>סוכרת או בעיה בבלוטת התריס</p>
          <Select
            name="diabetes"
            className="max-w-24"
            selectedKeys={[diabetes]}
            onChange={(e) => setDiabetes(e.target.value)}
            items={options}
            disallowEmptySelection
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <p>מחלת הנפילה</p>
          <Select
            name="epilepsy"
            className="max-w-24"
            selectedKeys={[epilepsy]}
            onChange={(e) => setEpilepsy(e.target.value)}
            items={options}
            disallowEmptySelection
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <p>מחלות בריאות אחרות העלולות להקשות על פעילות ספורטיבית</p>
          <Select
            name="other_issues"
            className="max-w-24"
            selectedKeys={[otherIssues]}
            onChange={(e) => setOtherIssues(e.target.value)}
            items={options}
            disallowEmptySelection
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
        </div>
      </div>
      <div className="mb-8 rounded-xl border border-danger bg-danger-50 px-3 py-2 text-danger">
        במידה ולא עשית פעילות פעילות ספורטיבית ב3 חודשים האחרונים מומלץ להיבדק
        אצל רופא, לקבל אישור רפואי ורק לאחר מכן לבוא לשחק אצלנו.
      </div>
      <div className="mb-6 flex flex-col gap-4">
        <Input
          name="full_name"
          placeholder="שם מלא כפי שמופיע בתעודת זהות"
          value={fullName}
          onChange={(e) => setFullname(e.target.value)}
        />
        <Input
          name="tz_id"
          placeholder="מספר תעודת זהות"
          value={tzId}
          onChange={(e) => setTzId(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button color="secondary" onPress={() => router.back()}>
          חזור
        </Button>
        <Button
          color="primary"
          isDisabled={
            !heartProblems ||
            heartProblems === "true" ||
            !exerciseDifficulty ||
            exerciseDifficulty === "true" ||
            !lungProblems ||
            lungProblems === "true" ||
            !diabetes ||
            diabetes === "true" ||
            !epilepsy ||
            epilepsy === "true" ||
            !otherIssues ||
            otherIssues === "true" ||
            fullName.length < 3 ||
            tzId.length !== 9
          }
          type="submit"
        >
          שמור
        </Button>
      </div>
    </form>
  );

  async function updateInsuranceStatement() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _updateInsuranceStatement({
        heart_problems: heartProblems === "true",
        exercise_difficulty: exerciseDifficulty === "true",
        lung_problems: lungProblems === "true",
        diabetes: diabetes === "true",
        epilepsy: epilepsy === "true",
        other_issues: otherIssues === "true",
        full_name: fullName,
        tz_id: tzId,
      });

      if (nextPageUrl.current) await router.replace(nextPageUrl.current);
      else await router.replace("/");

      toast.success("הצהרת ביטוח נשמרה בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
