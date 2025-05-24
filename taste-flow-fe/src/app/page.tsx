
import { Button } from "@/components/ui/button";
import { MoveRight, MoveLeft } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto  text-white ">
      {/* Top Banner */}
      <div className="max-w-2xl mx-auto px-4 py-8 text-center my-5">
        <h1 className="text-5xl font-bold">
          <span className="text-[#F26D16]">88 All-Time </span>
          Best Dinner Recipes to <span className="text-[#F26D16]">Savor</span>
        </h1>
        <p className="text-[#858787] mt-4 text-[17px]">
          Explore all-time favorite recipes packed with flavor, perfect for family meals and special occasions.
        </p>
        <Button className="bg-[#F26D16] rounded-full my-5 text-white">
          See Them All <MoveRight className="ml-1" />
        </Button>
      </div>

      {/* Banner Component */}
      <div
        className="w-[90%] max-w-[800px] h-[400px] bg-center bg-cover mx-auto my-5 rounded-[15px]"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg')",
        }}
      ></div>

      {/* Section Dishes */}
      <div className="max-w-[820px] my-4 mx-auto px-4 py-12 text-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 gap-8">
          {/* Left: Title */}
          <div className="md:w-1/2 text-left">
            <h2 className="text-4xl font-bold leading-tight">
              Crave-Worthy Dishes <br /> You’ll Love
            </h2>
          </div>

          {/* Right: Description + buttons */}
          <div className="md:w-1/2 flex flex-col items-end gap-4 text-left">
            <p className="text-sm text-gray-300 w-[290px]">
              Discover crave-worthy dishes you'll love—easy to make, full of flavor, and always satisfying.
            </p>
            <div className="flex gap-2">
              <Button className="w-7 h-7 bg-[#F26D16] ">
                <MoveLeft size={18} />
              </Button>
              <Button className="w-7 h-7 bg-[#F26D16] ">
                <MoveRight size={18} />
              </Button>
            </div>
          </div>
        </div>


        {/* Grid Dishes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition"
            >
              <img
                src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                alt="Easy Chicken Dinner"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-md">
                <p className="text-white text-sm font-medium">Easy Chicken Dinners,</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-300 text-xs">Deliciously Quick</p>
                  <Button className="w-7 h-7 bg-orange-500 hover:bg-orange-600 p-1 rounded-full">
                    <MoveRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Section */}
        <div className="my-20">
          <h1 className="text-4xl font-bold text-center my-12">Explore More</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="relative rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
                <img
                  src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                  alt="Explore Dish"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md p-4">
                  <p className="text-[12px] text-center text-gray-100 rounded-lg">
                    Comfort Food Classics
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-5 gap-2">
            <Button className="w-7 h-7 bg-[#F26D16]">
              <MoveLeft />
            </Button>
            <Button className="w-7 h-7 bg-[#F26D16]">
              <MoveRight />
            </Button>
          </div>
        </div>

        {/* Highlight Dish: Mac & Cheese */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center px-4 py-12 max-w-4xl mx-auto">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-orange-500 mb-4">
              Ultimate Creamy Mac and Cheese
            </h1>
            <h2 className="text-lg font-semibold text-white mb-2">
              Cheesy, comforting, and satisfying—these recipes bring flavor to every bite.
            </h2>
            <ul className="list-disc pl-5 text-gray-300 space-y-1 text-sm">
              <li>Rich, gooey cheese in every bite</li>
              <li>Comfort food made effortlessly delicious</li>
              <li>Perfect for family or solo cravings</li>
            </ul>
          </div>
          <div className="flex-1">
            <img
              src="https://th.bing.com/th/id/OIP.2EUlvJxLj0CvVQQZOq8wpQHaE7?rs=1&pid=ImgDetMain"
              alt="Food"
              className="w-full h-auto max-h-[350px] object-cover rounded-xl shadow-md"
            />
          </div>
        </div>


        <div className="my-20">
          <h1 className="text-4xl font-bold text-center my-12">Fan Favorites</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="relative rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition"
              >
                <img
                  src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                  alt="Explore Dish"
                  className="w-full h-48 object-cover"
                />

                {/* Overlay Blur */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md p-3">
                  <p className="text-white text-center text-sm font-semibold">Oven-Baked Ribs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="w-[95%] max-w-[800px] h-[350px] bg-center bg-cover mx-auto my-5 rounded-[15px] relative overflow-hidden shadow-lg"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/originals/c8/ab/c8/c8abc8d040b09bf0ae0fb7bb3bd17672.jpg')",
          }}
        >
          {/* Overlay blur and dark background */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6 py-8 ">
            <div className="w-[450px]">
              <h1 className="text-3xl font-bold text-white mb-4 ">
                Dinner Favorites You'll Crave Again and Again
              </h1>
              <p className="text-gray-200 text-sm mb-6">
                Discorver 88 delicious dinner recipes that are easy to make, full of flavorm and family-approved
              </p>
              <Button className="bg-[#F26D16] hover:bg-orange-600 text-white font-semibold rounded-full px-6 py-2 transition">
                View Recipes Now <MoveRight className="ml-1" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}
