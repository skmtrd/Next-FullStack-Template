import { userAuthenticationCheck } from "@/app/actions/userAuthenticationCheck";
import DashboardPage from "@/components/domain/(authenticated)/dashboard/DashboardPage";

const Page = async () => {
  await userAuthenticationCheck();
  return <DashboardPage />;
};

export default Page;
