import Footer from "@/components/Footer";
import HomeBanner from "@/components/HomeBanner";
import Navbar from "@/components/Navbar";
import Section1 from "@/components/Section1";
import Premium from "@/components/Premium";
import Image from "next/image";
import Newsection from "@/components/Newsection";
import Products from "@/components/Product";
import AllServices from "@/components/AllServices";
import CategoryWiseDist from "@/components/CategoryWiseDist";
import Cousersal from "@/components/cousersal";
import WhyChooseUs from "@/components/WhyChooseUs";
import Video from "@/components/Video";


export default function Home() {
  return (
  <>
 
  <HomeBanner />
  <AllServices />
  <Section1 />
  <Premium />
  <Products />
  
    
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 justify-items-center">
      <Video src="/vid1.mp4" poster="/img1.png" width={330} height={610} />
      <Video src="/vid2.mp4" poster="/img2.png" width={330} height={610} />
      <Video src="/vid3.mp4" poster="/img3.1.png" width={330} height={610} />
      <Video src="/vid4.mp4" poster="/img5.2.png" width={330} height={610} />
    </div>
  
  <Newsection />
  <Cousersal />
  <CategoryWiseDist />
<WhyChooseUs />
  </>
  );
}
