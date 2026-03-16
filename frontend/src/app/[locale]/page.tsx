// import Home from "@/app/[locale]/home/page";
import { redirect } from "@/i18n/navigation";

export default function RootPage() {
  // return <Home />;
  redirect({ href: "/dashboard", locale: "vi" });
}
