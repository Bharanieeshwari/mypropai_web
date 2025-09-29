import { Route } from "react-router-dom";

// Post Property 
import PostProperty from "@/features/postproperty/PostProperty";
import PropertyDetails from "@/features/viewproperty/propertydetails/PropertyDetails";
import UserListings from "@/features/viewproperty/user/UserListings";

// View Property 
import PropertyListing from "@/features/viewproperty/propertylisting/PropertyListing";
import Wishlist from "@/features/viewproperty/user/Wishlist";

const PropertyRoutes = () => (
  <>
    {/* Post Property */}
    <Route path="/postproperty" element={<PostProperty />} />
    <Route path="/property-details/:propertyId" element={<PropertyDetails />} />
    <Route path="/my-listing" element={<UserListings />} />

    {/* View Property */}
    <Route path="/property-listing" element={<PropertyListing />} />
    <Route path="/wishlist" element={<Wishlist />} />
  </>
);

export default PropertyRoutes;
