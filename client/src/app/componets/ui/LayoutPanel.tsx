import Panel from "@/app/componets/ui/Panel";
import style from "./css/LayoutPanel.module.css";
export default function LayoutPanel() {
  return (
    <div className={style.layout}>
      <div className={style.main}>메인 영역</div>
      <Panel />
    </div>
  );
}
