import { useContext } from "react";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEnvelope, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

export function Profile() {
  const { user } = useContext(FirebaseContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-inter">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header/Cover */}
        <div className="h-32 bg-ucsd-blue"></div>
        
        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="absolute -top-12 left-6">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <FontAwesomeIcon 
                icon={faUserCircle} 
                className="w-24 h-24 text-gray-400 bg-white rounded-full border-4 border-white shadow-lg" 
              />
            )}
          </div>

          {/* User Info */}
          <div className="pt-16">
            <h1 className="text-3xl font-bold text-gray-800">
              {user.displayName || "User Name"}
            </h1>
            <div className="mt-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faEnvelope} className="w-5 mr-3" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-5 mr-3" />
                <span>Member since {new Date(user.metadata.creationTime ?? "").toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Placeholder for future features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-bold text-lg text-ucsd-blue">My Listings</h3>
              <p className="text-sm text-gray-500">Manage the items you are selling.</p>
            </div>
            <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-bold text-lg text-ucsd-blue">Saved Items</h3>
              <p className="text-sm text-gray-500">View items you've bookmarked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}