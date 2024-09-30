import { IoIosHeart } from "react-icons/io";
import { FaComment } from "react-icons/fa";

export default function GroupChat() {
  return (
    <div className="mt-4 mb-16">
      <h1 className="text-2xl font-semibold pb-3">Announcements</h1>

      <div className="flex flex-col gap-5 mb-8">
        <div className="flex flex-col gap-4 bg-white shadow-md rounded-lg py-6 px-3">
          <div className="flex items-center justify-start gap-3">
            <img
              src="https://res.cloudinary.com/demo/image/facebook/s--ZuJGmG2B--/65646572251"
              alt="Profile Picture"
              className="size-16 rounded-full"
            />

            <div>
              <h3 className="font-bold">John Doe</h3>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              tincidunt, nisl nec molestie commodo, nisl nisl aliquet nisl, nec
              aliquet nisl. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed tincidunt, nisl nec molestie commodo, nisl nisl aliquet
              nisl, nec aliquet nisl.
            </p>

            <div className="flex flex-col gap-4">
              <img
                src="https://res-console.cloudinary.com/victormugisha/thumbnails/v1/image/upload/v1725990360/c2FtcGxlcy9jb2ZmZWU=/drilldown"
                alt="Post Image"
                className="w-full h-64 object-cover rounded-lg"
              />

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <IoIosHeart className="text-red-500 text-lg" />
                    <p className="text-xs text-gray-500">2</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaComment className="text-gray-500 text-lg" />
                    <p className="text-xs text-gray-500">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 bg-white shadow-md rounded-lg py-6 px-3">
          <div className="flex items-center justify-start gap-3">
            <img
              src="https://res.cloudinary.com/demo/image/facebook/s--ZuJGmG2B--/65646572251"
              alt="Profile Picture"
              className="size-16 rounded-full"
            />

            <div>
              <h3 className="font-bold">John Doe</h3>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              tincidunt, nisl nec molestie commodo, nisl nisl aliquet nisl, nec
              aliquet nisl. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed tincidunt, nisl nec molestie commodo, nisl nisl aliquet
              nisl, nec aliquet nisl.
            </p>

            <div className="flex flex-col gap-4">
              <img
                src="https://res-console.cloudinary.com/victormugisha/thumbnails/v1/image/upload/v1725990360/c2FtcGxlcy9jb2ZmZWU=/drilldown"
                alt="Post Image"
                className="w-full h-64 object-cover rounded-lg"
              />

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <IoIosHeart className="text-red-500 text-lg" />
                    <p className="text-xs text-gray-500">2</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaComment className="text-gray-500 text-lg" />
                    <p className="text-xs text-gray-500">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
