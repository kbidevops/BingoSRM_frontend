import dayjs from "dayjs";
import i18n from "i18next";

function changeLanguage(lang: string) {
  i18n.changeLanguage(lang);
  switch (lang) {
    case "en":
      dayjs.locale("en");
      break;
    case "kr":
      dayjs.locale("ko");
      break;
    default:
      dayjs.locale("ko");
      break;
  }
}

export default changeLanguage;
