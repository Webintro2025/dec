import ConsultationForm from "@/components/ConsultationForm";

import { locations } from "../../../marketplace";


export async function generateMetadata({ params }) {
    const {slug} = await params;
    // Convert slug to city name (reverse the slug logic)
    const rawCity = locations.find(
  (loc) => loc.toLowerCase().replace(/\s+/g, '-') === slug
);
const cityName = rawCity
  ? rawCity
      .toLowerCase()
      .split(/[\s-]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  : "Location";
    const url = `https://ekotique.com/ceiling-light-manufacturers-in/${slug}`;
    return {
      title: `Ceiling Light Manufacturers in ${cityName} | Ekotique`,
      description: `Looking for premium Ceiling Light Manufacturers in ${cityName}? Ekotique offers, Best Ceiling Light Manufacturers in ${cityName}, Hanging Lights Manufactures in ${cityName}.`,
      keywords: [
       `Ceiling Light Manufacturers in ${cityName}`,
       `Decorative Lighting Solutions in ${cityName}`,
       `Eco-Friendly Ceiling and Paper Lights in ${cityName}`,
       `Custom Decorative Lighting Manufacture in ${cityName}`,
       `Chandelier Lights Manufacture in ${cityName}`,
       `Paper Lights Manufacture in ${cityName}`,
       `Hanging Lights Manufacture in ${cityName}`,
       'Ekotique decorative lighting',
      ],
      openGraph: {
        title: `Ceiling Light Manufacturers in ${cityName} | Ekotique`,
        description: `Ekotique is a trusted Ceiling Light Manufacturer in ${cityName}, supplying bamboo, rattan, fabric, and chandelier lights that enhance modern interiors with natural elegance and warm illumination.`,
        url,
        siteName: "Ekotique",
      },
        alternates: {
            canonical: url
        },
        robots: {
            index: true,
            follow: true
        }
    };
}

export default async function LocationPage({ params }) {
    const {slug} =  await params;
    const rawLocation = locations.find(
        (loc) => loc.toLowerCase().replace(/\s+/g, '-') === slug
    );
    const locationName = rawLocation
        ? rawLocation
                .toLowerCase()
                .split(/[\s-]+/)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')
        : null;
    if (!locationName) {
        return <main className="max-w-2xl mx-auto py-10 px-4"><h1 className="text-2xl font-bold">Location Not Found</h1></main>;
    }
  return (

    <main className="w-full ">

     



<div className="relative w-full bg-[url('/footer1.png')] bg-cover bg-center bg-no-repeat
  h-[120px] xs:h-[140px] sm:h-[200px] md:h-[260px] lg:h-[320px] xl:h-[360px]">
    

  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-10">
    <img src="" alt="" />
        <h1 className="text-black font-serif text-sm xs:text-base sm:text-xl md:text-2xl lg:text-2xl xl:text-5xl leading-tight drop-shadow-md">
          Ceiling Light Manufacturers in {locationName}
        </h1>
        <p className="text-black font-medium text-[10px] xs:text-xs sm:text-sm md:text-base mt-2 sm:mt-4 max-w-xs xs:max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl drop-shadow">
          Welcome To Ekotique, If You Are Looking For Ceiling Light Manufacturers in {locationName}, We Are The Best Option For You. We Manufacture Best Ceiling Light Manufacturers in {locationName}, Hanging Lights Manufacture in {locationName}, Paper Lights Manufacture in {locationName}, India.
        </p>
    
  </div>
</div>







<div className="bg-white px-10">
  <main className="w-full px-3 xs:px-4 sm:px-6 py-6 sm:py-8 md:py-10">
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
      <section className="w-full md:w-1/2 text-black">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl leading-[1.2] font-semibold mb-3 sm:mb-4 md:mb-6 max-w-[600px]">
          Ceiling Light Manufacturers in {locationName} - Ekotique
        </h2>
        <p className="mb-4 sm:mb-6 max-w-[600px] text-xs xs:text-sm sm:text-base leading-relaxed font-normal">
          Ekotique, based in New Delhi, India, is a trusted and rapidly growing name among professional <strong>Ceiling Light Manufacturers in {locationName}</strong>, offering premium decorative and functional lighting solutions for modern interiors. Established as a Proprietorship under the ownership of Mr. Shubham Arya and Ms. Sonia Sivakumar, we specialize in wholesale and distribution of high-quality ceiling lights designed to enhance both aesthetics and illumination.
          <br />
          <br />
          With a strong focus on design excellence, durability, and customer satisfaction, Ekotique supplies <strong>Ceiling Light Manufacturers in {locationName}</strong>, solutions that are ideal for homes, hotels, offices, cafés, showrooms, restaurants, and interior décor projects across India. Our products reflect a perfect blend of contemporary trends, artistic craftsmanship, and reliable performance.
        </p>
      </section>
      <div className="w-full h-[500px] md:w-1/2 flex justify-center">
        <img
          alt={`Bamboo Light Manufacturers in ${locationName}`}
          className="object-cover rounded-lg w-full max-w-[350px] xs:max-w-[400px] sm:max-w-[450px] md:max-w-[500px] h-auto shadow"
         height={300}
          src="/s2.jpg"
        
        />
      </div>
    </div>
  </main>
</div>



<hr />




<div className="bg-white w-full px-16 xs:px-16 sm:px-16 py-6 sm:py-10 flex flex-col md:flex-row md:space-x-10 lg:space-x-20 ">
  <div className="w-full md:w-1/2 flex flex-col justify-center">
    <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl leading-[1.2] mb-3 sm:mb-6 font-semibold">
      Leading Ceiling Light Manufacturers in India
    </h2>
    <p className="text-xs xs:text-sm sm:text-base leading-relaxed max-w-xl">
      As one of the emerging <strong>Ceiling Light Manufacturers in India</strong>, Ekotique understands the evolving lighting needs of modern spaces. Ceiling lights play a crucial role in defining ambiance, improving functionality, and complementing interior themes. Our ceiling lighting solutions are thoughtfully designed to deliver balanced illumination while serving as elegant design elements.
      <br />
      <br />
      Each product is developed with attention to material quality, finishing, and long-term durability, making Ekotique a preferred choice for interior designers, architects, contractors, and bulk buyers nationwide.
    </p>
  </div>
  <div className="w-full md:w-1/3  p-4 sm:p-6 md:p-8 mt-8 md:mt-0 flex flex-col justify-center ">
  
 <ConsultationForm /> 
  </div>
</div>
<hr />
<div>
 

</div>
<hr />











<div className="w-full mx-auto px-16 xs:px-16 sm:px-16 py-6 sm:py-8 md:py-10">
  <h2 className="text-center mx-auto text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif leading-[1.2] mb-4 sm:mb-6 text-black max-w-2xl sm:max-w-3xl md:max-w-4xl">
    Our Premium Ceiling Light Manufacturers in {locationName} Product Range
  </h2>
  <p className="text-xs xs:text-sm sm:text-base mt-2 sm:mt-3 leading-[1.6]  mx-auto text-center">
    At Ekotique <strong>Ceiling Light Manufacturers in {locationName}</strong>, we offer a premium and diverse range of ceiling lighting solutions designed to enhance interiors with style, comfort, and functional illumination. Each product category is crafted or sourced with careful attention to design, performance, and long-term durability, making our ceiling lights suitable for residential, hospitality, commercial, and designer spaces across India.
  </p>
  <ul className="space-y-4 sm:space-y-6 text-xs xs:text-sm sm:text-base mt-4 sm:mt-5 leading-[1.6] list-none">
    <li>
      <span className="font-bold">1. Pendant Lights Manufacture in {locationName}</span><br />
      Pendant lights are one of the most versatile and stylish ceiling lighting solutions. At Ekotique <strong>Pendant Lights Manufacture in {locationName}</strong>, our pendant lights are designed to hang gracefully from the ceiling, creating focused illumination with strong visual appeal. Available in modern, minimalist, rustic, and decorative designs, these lights add depth and character to interiors.<br />
      <strong>Uses:</strong> Pendant lights are widely used over dining tables, kitchen islands, reception desks, cafés, bars, retail counters, and living spaces where both function and aesthetics are essential.
    </li>
    <li>
      <span className="font-bold">2. Hanging Lights Manufacture in {locationName}</span><br />
      Our hanging lights are crafted to enhance vertical spaces and create dramatic lighting effects. At <strong>Hanging Lights Manufacture in {locationName}</strong>, Designed with premium materials and superior finishing, hanging lights serve as statement pieces that elevate interior décor.<br />
      <strong>Uses:</strong> Ideal for hotel lobbies, staircases, double-height living areas, showrooms, banquet halls, and luxury commercial spaces where impactful lighting is required.
    </li>
    <li>
      <span className="font-bold">3. Paper Lights Manufacture in {locationName}</span><br />
      Paper lights offer a soft, artistic, and eco-friendly lighting option. At <strong>Paper Lights Manufacture in {locationName}</strong>, These ceiling lights diffuse light gently, creating a warm and calming ambiance. Lightweight and elegant, paper lights blend seamlessly with contemporary and creative interior themes.<br />
      <strong>Uses:</strong> Commonly used in bedrooms, lounges, cafés, creative studios, boutique hotels, and relaxed living environments where soothing illumination is preferred.
    </li>
    <li>
      <span className="font-bold">4. Customised Lights Manufacture in {locationName}</span><br />
      Ekotique specializes in customised ceiling lighting solutions tailored to specific design concepts and project requirements. At <strong>Customised Lights Manufacture in {locationName}</strong>From size and shape to material and finish, our customised lights are developed in collaboration with designers and clients to match unique interior visions.<br />
      <strong>Uses:</strong> Customised lights are ideal for themed interiors, hospitality projects, luxury residences, retail spaces, and architectural lighting installations that demand exclusivity.
    </li>
  </ul>

  <div className=" bg-[#BD9975] rounded-xl p-4 sm:p-6 mt-6 max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
    <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-black mb-2 text-center">📞 Contact us today to discuss your requirements, request a quote, or place an order.</h3>
  <p className="text-xs xs:text-sm sm:text-base text-black mb-2 text-center">If you are Looking for the <strong>Best Ceiling Light Manufacturers in {locationName}</strong>? Ekotique is your trusted partner.</p> <br/> 
      <ul className="list-disc pl-4 sm:pl-6 text-xs xs:text-sm sm:text-base text-black mb-2">
      <li>👉 <strong>Call Now:</strong> +91 8821904444</li>
      <li>👉 <strong>Visit Our Website</strong> <a href="https://ekotique.com/">www.ekotique.com</a></li>
      <li>👉 <strong>Our Email Address</strong> – ekotique.deco@gmail.com </li>
    </ul>
  </div>
</div>

<div className="bg-white text-[#1a1a1a] w-full mx-auto px-16 xs:px-16 sm:px-16 py-6 sm:py-8 md:py-10">
  <div className="flex flex-col md:flex-row gap-6 md:gap-10 border-t border-b border-gray-300 py-4 sm:py-6">
    <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-300 pr-0 md:pr-6 pb-6 md:pb-0">
      <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl text-center leading-[1.2] mb-4 sm:mb-8 font-semibold">
  Applications of Our Decorative Lighting Solutions
      </h2>
      <p>
        As reliable <strong>Ceiling Light Manufacturers in {locationName}</strong>, our products are widely used across:<br/><br/>
        🔹 Residential homes and apartments<br/>
        🔹 Hotels and hospitality interiors<br/>
        🔹 Cafés, restaurants, and lounges<br/>
        🔹 Corporate offices and reception areas<br/>
        🔹 Retail showrooms and boutiques<br/>
        🔹 Interior décor and architectural projects<br/>
       
      </p>
    </div>
    <div className="w-full md:w-1/2 pl-0 md:pl-6 mt-8 md:mt-0">
      <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl text-center leading-[1.2] mb-4 sm:mb-8 font-semibold">
  Quality & Design Excellence
      </h2>
            <p>
        Every ceiling light supplied by Ekotique undergoes strict quality checks to ensure durability, safety, and visual perfection. We focus on using premium materials, advanced finishing techniques, and reliable electrical components to deliver long-lasting performance.

Our designs reflect modern sensibilities while remaining versatile enough to suit a wide range of interior styles.<br/><br/>

As experienced <strong>Ceiling Light Manufacturers in {locationName}</strong>, Ekotique ensures that each product meets aesthetic expectations while maintaining structural integrity and safety standards.
      </p>
      
    </div>
  </div>
</div>





<div className="w-full mx-auto px-16 xs:px-16 sm:px-16 py-6 sm:py-8 md:py-10">
  <h2 className="text-center mx-auto text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif leading-[1.2] mb-4 sm:mb-6 text-black max-w-2xl sm:max-w-3xl md:max-w-4xl">
    Why Choose Ekotique Ceiling Light Manufacturers in {locationName}?
  </h2>
  <p className="text-xs xs:text-sm sm:text-base mt-2 sm:mt-3 leading-[1.6]  mx-auto text-center">
    Below are the key reasons why businesses, designers, and professionals trust Ekotique as their preferred Ceiling Light Manufacturers in {locationName}:
  </p>
  <ul className="space-y-4 sm:space-y-6 text-xs xs:text-sm sm:text-base mt-4 sm:mt-5 leading-[1.6] list-none">
    <li>
      <span className="font-bold">1. Innovative Design Approach</span><br />
      We stay ahead of interior lighting trends to offer ceiling lights that are stylish, functional, and visually distinctive.
    </li>
    <li>
      <span className="font-bold">2. Premium Quality Products</span><br />
      Our ceiling lights are known for superior finishing, strong build quality, and dependable illumination performance.
    </li>
    <li>
      <span className="font-bold">3. Customisation Expertise</span><br />
      We offer tailored lighting solutions to meet specific project needs, ensuring complete alignment with the design vision.
    </li>
    <li>
      <span className="font-bold">4. Wholesale & Bulk Supply Capability</span><br />
      With a dedicated wholesale setup, we efficiently handle bulk orders and ensure smooth distribution across India.
    </li>
    <li>
      <span className="font-bold">5. Customer-Centric Business Model</span><br />
      At Ekotique, customer satisfaction drives every decision. We prioritize timely delivery, transparent communication, and consistent quality.
    </li>
    <li>
      <span className="font-bold">6. Trusted Ceiling Light Manufacturers in {locationName}</span><br />
      Our growing reputation as reliable <strong>Ceiling Light Manufacturers in {locationName}</strong> is built on trust, professionalism, and long-term partnerships.
    </li>
  </ul>
</div>

<hr />
<div className="w-full mx-auto px-16 xs:px-16 sm:px-16 py-6 sm:py-8 md:py-10">
  <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif mb-2 sm:mb-4">Conclusion:-</h2>
  <p className="text-xs xs:text-sm sm:text-base font-sans text-black leading-relaxed">
   If you are searching for dependable and design focused <strong>Ceiling Light Manufacturers in {locationName}</strong>, Ekotique is your ideal destination. Our comprehensive range of pendant lights, hanging lights, paper lights, and customized ceiling lighting solutions offers the perfect balance of style, functionality, and durability. We don’t just supply lights—we help create inspiring spaces illuminated with elegance and purpose.
  </p>
</div>

    </main>
  );
}
