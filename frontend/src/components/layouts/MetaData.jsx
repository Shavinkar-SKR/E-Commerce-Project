import { Helmet } from "react-helmet-async";

export default function MetaData({ title }) {
  return (
    <Helmet>
      <title>{`${title} - ECommerce Marketplace`}</title>
    </Helmet>
  );
}
