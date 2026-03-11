import BrandIcon from "@/app/components/common/icons/BrandIcon";
import OneTimePopup from "@/app/components/common/modals/OneTimePopup/OneTimePopup";

export default function SafetyPopup() {
  return (
    <OneTimePopup id="safety-announcement-v1" ctaText="הבנתי, נתראה במגרש">
      <BrandIcon className="mx-auto h-16 w-16 self-center" />
      <h2 className="text-center text-2xl font-bold">
        ⚽ מעדכנים ושומרים על שגרת משחק!
      </h2>
      <div className="flex w-full flex-col gap-3 text-right text-sm leading-relaxed">
        <p>
          <strong>שחקנים יקרים, אנחנו ממשיכים לשחק!</strong>
          <br />
          חשוב לנו שתדעו שהמשחקים מתקיימים במגרשים הצמודים למרחב מוגן תקני.
        </p>
        <ul className="flex flex-col gap-2">
          <li>
            🆘 <strong>במקרה של אזעקה:</strong> יש להישמע להוראות הצוות
            ולהיכנס מיד למקלט/מרחב מוגן.
          </li>
          <li>
            🛡️ <strong>הביטחון שלכם מעל הכל</strong> – משחקים באחריות.
          </li>
        </ul>
      </div>
    </OneTimePopup>
  );
}
