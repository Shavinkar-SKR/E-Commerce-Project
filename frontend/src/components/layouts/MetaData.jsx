import { Helmet } from "react-helmet-async"; //helmet component is used to manage changes to the document head (like title, meta tags) asynchronously.

export default function MetaData({ title }) {
  return (
    <Helmet>
      {/* Helmet allows us to inject elements into the <head> section of the HTML document */}
      <title>{`${title} - ECommerce Marketplace`}</title>
    </Helmet>
  );
}
