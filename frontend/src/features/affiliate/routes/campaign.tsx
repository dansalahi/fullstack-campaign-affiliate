import Loading from "../../../components/Loading";
import { useGetAllCampaigns } from "../api/useCampaign";
import CampaignCard from "../components/CampaignCard";

const Campaign = () => {
  const { data, isLoading, isError, error } = useGetAllCampaigns();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="py-6 grid grid-cols-4 gap-4 justify-items-center max-w-screen-xl mx-auto">
      {data?.map((campaign) => (
        <CampaignCard key={campaign._id} campaign={campaign} />
      ))}
      {!data && (
        <div className="col-span-4">
          <p className="text-2xl font-bold text-center">No campaigns found</p>
        </div>
      )}
    </div>
  );
};

export default Campaign;
