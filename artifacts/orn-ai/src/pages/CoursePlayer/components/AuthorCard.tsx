interface AuthorCardProps {
  instructor: any;
}

const AuthorCard = ({
  instructor,
}: AuthorCardProps) => {
  const fullName = [
    instructor?.firstName,
    instructor?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">
        Instructor
      </h2>

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        {/* Avatar */}
        <div className="shrink-0">
          {instructor?.image ? (
            <img
              src={instructor.image}
              alt={fullName}
              className="
                h-24
                w-24
                rounded-full
                object-cover
                border-4
                border-gray-100
              "
            />
          ) : (
            <div
              className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-2xl
                font-bold
                text-gray-500
              "
            >
              {fullName?.charAt(0) || "I"}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">
            {fullName || "Instructor"}
          </h3>

          {instructor?.email && (
            <p className="mt-2 text-gray-600">
              {instructor.email}
            </p>
          )}

          {instructor?.contactNumber && (
            <p className="mt-1 text-gray-600">
              {instructor.contactNumber}
            </p>
          )}

          {instructor?.bio && (
            <p className="mt-4 leading-7 text-gray-600">
              {instructor.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;