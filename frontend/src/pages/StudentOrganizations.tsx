import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { get } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";

interface StudentOrganization {
  _id: string;
  organizationName: string;
  profilePicture: string;
  bio: string;
  location: string;
  contactInfo: {
    email: string;
    instagram: string;
    website: string;
    other: string;
  };
  merchLocation: string;
}

interface MerchItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  studentOrganizationId: {
    _id: string;
    organizationName: string;
    profilePicture: string;
    bio: string;
    location: string;
    contactInfo: {
      email: string;
      instagram: string;
      website: string;
      other: string;
    };
    merchLocation: string;
  };
}

export function StudentOrganizations() {
  const { user } = useContext(FirebaseContext);
  const [organizations, setOrganizations] = useState<StudentOrganization[]>([]);
  const [allMerch, setAllMerch] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orgsRes, merchRes] = await Promise.all([
          get("/api/student-organizations"),
          get("/api/merch"),
        ]);

        if (orgsRes.ok) {
          const orgsData = await orgsRes.json();
          setOrganizations(orgsData);
        }

        if (merchRes.ok) {
          const merchData = await merchRes.json();
          setAllMerch(merchData);
        }
      } catch (err) {
        setError("Failed to load student organizations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMerchForOrg = (orgId: string) => {
    return allMerch.filter((merch) => merch.studentOrganizationId._id === orgId);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Student Organizations - Low-Price Center</title>
        </Helmet>
        <div className="w-full mt-12 mb-6">
          <p className="text-center font-inter">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Student Organizations - Low-Price Center</title>
      </Helmet>
      <main className="w-full flex justify-center items-center mt-12 mb-20">
        <div className="max-w-[90%] w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-jetbrains font-medium mb-2">Student Organizations</h1>
            <p className="text-gray-600 font-inter">
              Browse student organizations and their merch
            </p>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {organizations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No student organizations found.</p>
          ) : (
            <div className="space-y-6">
              {organizations.map((org) => {
                const orgMerch = getMerchForOrg(org._id);
                const isExpanded = selectedOrg === org._id;

                return (
                  <div
                    key={org._id}
                    className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200"
                  >
                    {/* Organization Header */}
                    <div className="flex items-start gap-4 mb-4">
                      {org.profilePicture && (
                        <img
                          src={org.profilePicture}
                          alt={org.organizationName}
                          className="w-20 h-20 object-cover rounded-full border-2 border-gray-300"
                        />
                      )}
                      <div className="flex-1">
                        <h2 className="text-2xl font-jetbrains font-semibold mb-2">
                          {org.organizationName}
                        </h2>
                        {org.bio && (
                          <p className="text-gray-700 font-inter mb-2">{org.bio}</p>
                        )}
                        {org.location && (
                          <p className="text-sm text-gray-600 font-inter mb-1">
                            📍 {org.location}
                          </p>
                        )}
                        {org.merchLocation && (
                          <p className="text-sm text-[#00629B] font-inter font-semibold">
                            🛍️ Merch available at: {org.merchLocation}
                          </p>
                        )}
                        {/* Contact Info */}
                        <div className="mt-2 flex flex-wrap gap-3 text-sm">
                          {org.contactInfo.email && (
                            <a
                              href={`mailto:${org.contactInfo.email}`}
                              className="text-[#00629B] hover:underline"
                            >
                              ✉️ {org.contactInfo.email}
                            </a>
                          )}
                          {org.contactInfo.instagram && (
                            <span className="text-gray-600">📷 @{org.contactInfo.instagram}</span>
                          )}
                          {org.contactInfo.website && (
                            <a
                              href={org.contactInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00629B] hover:underline"
                            >
                              🌐 Website
                            </a>
                          )}
                        </div>
                      </div>
                      {orgMerch.length > 0 && (
                        <button
                          onClick={() => setSelectedOrg(isExpanded ? null : org._id)}
                          className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
                        >
                          {isExpanded ? "Hide" : "View"} Merch ({orgMerch.length})
                        </button>
                      )}
                    </div>

                    {/* Merch Items */}
                    {isExpanded && orgMerch.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-gray-200">
                        <h3 className="text-xl font-jetbrains font-semibold mb-4">Merch Items</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {orgMerch.map((merch) => (
                            <div
                              key={merch._id}
                              className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                            >
                              {merch.image && (
                                <img
                                  src={merch.image}
                                  alt={merch.name}
                                  className="w-full h-48 object-cover rounded-md mb-3"
                                />
                              )}
                              <h4 className="font-inter font-semibold text-lg mb-1">{merch.name}</h4>
                              <p className="font-inter font-bold text-[#00629B] text-xl mb-2">
                                ${merch.price.toFixed(2)}
                              </p>
                              {merch.description && (
                                <p className="font-inter text-sm text-gray-600">{merch.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isExpanded && orgMerch.length === 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-gray-200">
                        <p className="text-gray-500 text-center py-4">
                          No merch items available yet.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

