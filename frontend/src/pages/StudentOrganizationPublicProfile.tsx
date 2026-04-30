import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "src/api/requests";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  studentOrganizationId: string;
}

type TabKey = "selling" | "likes" | "saves";

export function StudentOrganizationPublicProfile() {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<StudentOrganization | null>(null);
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("selling");

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const [orgRes, merchRes] = await Promise.all([
          get("/api/student-organizations"),
          get("/api/merch"),
        ]);

        if (!orgRes.ok) throw new Error("Failed to load organization");
        const orgs: StudentOrganization[] = await orgRes.json();
        const found = orgs.find((o) => o._id === id) || null;
        setOrganization(found);

        if (merchRes.ok) {
          const allMerch: any[] = await merchRes.json();
          const normalized: MerchItem[] = allMerch
            .map((m) => ({
              _id: m._id,
              name: m.name,
              price: m.price,
              description: m.description,
              image: m.image,
              studentOrganizationId:
                typeof m.studentOrganizationId === "string" ? m.studentOrganizationId : m.studentOrganizationId?._id,
            }))
            .filter((m) => m.studentOrganizationId === id);
          setMerchItems(normalized);
        }
      } catch (e) {
        setError("Failed to load organization profile.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  const title = useMemo(() => {
    if (loading) return "Student Organization - Low-Price Center";
    if (!organization) return "Organization not found - Low-Price Center";
    return `${organization.organizationName} - Low-Price Center`;
  }, [loading, organization]);

  const StarRating = ({ rating = 0 }: { rating?: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={star <= rating ? faStarSolid : faStar}
            className={star <= rating ? "text-figma-orange" : "text-gray-300"}
            size="sm"
          />
        ))}
        <span className="ml-1 text-gray-700 font-inter">({rating})</span>
      </div>
    );
  };

  const TabButton = ({ tab, label }: { tab: TabKey; label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={[
          "font-inter text-xl md:text-2xl font-semibold",
          isActive ? "text-figma-charcoal underline underline-offset-8" : "text-gray-400",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
          <p className="text-center font-inter text-gray-700">Loading...</p>
        </div>
      </>
    );
  }

  if (!organization) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
            <p className="font-inter text-gray-700">{error || "Organization not found."}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-figma-mint shadow-md overflow-hidden">
            {/* Header band */}
            <div className="bg-figma-sand border-b-2 border-figma-orange h-28 md:h-32 relative">
              {/* profile image */}
              <div className="absolute left-6 md:left-10 top-10 md:top-12">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-1 shadow-sm">
                  {organization.profilePicture ? (
                    <img
                      src={organization.profilePicture}
                      alt={organization.organizationName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200" />
                  )}
                </div>
              </div>

              {/* title */}
              <div className="absolute left-36 md:left-44 top-6 md:top-7">
                <h1 className="font-inter font-extrabold text-2xl md:text-4xl leading-tight text-black">
                  {organization.organizationName || "Username"}
                </h1>
              </div>
            </div>

            {/* Info row */}
            <div className="px-6 md:px-10 pt-8 pb-4">
              <StarRating rating={0} />
              <div className="mt-2 text-sm md:text-base text-gray-400 font-inter leading-snug">
                {organization.bio ? <div className="truncate">{organization.bio}</div> : null}
                {organization.contactInfo?.email ? (
                  <div className="truncate">{organization.contactInfo.email}</div>
                ) : null}
                {organization.merchLocation ? <div className="truncate">{organization.merchLocation}</div> : null}
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 md:px-10 pb-4">
              <div className="flex gap-10 flex-wrap">
                <TabButton tab="selling" label="Selling" />
                <TabButton tab="likes" label="Likes" />
                <TabButton tab="saves" label="Saves" />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 md:px-10 pb-10">
              {activeTab !== "selling" ? (
                <div className="py-10 text-center text-gray-500 font-inter">
                  Nothing to show yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {merchItems.map((merch) => (
                    <div key={merch._id} className="bg-white">
                      <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden shadow-sm">
                        {merch.image ? (
                          <img src={merch.image} alt={merch.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="font-inter font-bold text-sm md:text-base text-black truncate">
                          {merch.name || "Product"}
                        </div>
                        <div className="font-inter font-extrabold text-sm md:text-base text-black">
                          ${Number.isFinite(merch.price) ? merch.price.toFixed(0) : "0"}
                        </div>
                      </div>
                    </div>
                  ))}

                  {merchItems.length === 0 ? (
                    <div className="col-span-2 md:col-span-3 py-10 text-center text-gray-500 font-inter">
                      No products yet.
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

