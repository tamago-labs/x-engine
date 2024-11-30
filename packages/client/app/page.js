import Image from "next/image";
import DashboardContainer from "../components/dashboard"

export default function Home() {
  return (
    <div className=" h-full w-full flex ">
      <div className="my-auto w-full">
        <DashboardContainer />
      </div> 
    </div>
  );
}
