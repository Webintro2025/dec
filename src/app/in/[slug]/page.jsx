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
    const url = `https://ekotique.com/bamboo-light-manufacturers-in/${slug}`;
    return {
      title: `Bamboo Light Manufacturers in ${cityName} | Ekotique`,
      description: `Looking for premium Bamboo Light Manufacturers in ${cityName}? Ekotique offers, Best Bamboo Light Manufacturers in ${cityName}, Rattan Light Manufactures in ${cityName}.`,
      keywords: [
       `Bamboo Light Manufacturers in ${cityName}`,
       `Decorative Lighting Solutions in ${cityName}`,
       `Eco-Friendly Bamboo and Rattan Lights in ${cityName}`,
       `Custom Decorative Lighting Manufacture in ${cityName}`,
       `Chandelier Lights Manufacture in ${cityName}`,
       `Fabric Lights Manufacture in ${cityName}`,
       `Rattan Lights Manufacture in ${cityName}`,
       'Ekotique decorative lighting',
      ],
      openGraph: {
        title: `Bamboo Light Manufacturers in ${cityName} | Ekotique`,
        description: `Ekotique is a trusted Bamboo Light Manufacturer in ${cityName}, supplying bamboo, rattan, fabric, and chandelier lights that enhance modern interiors with natural elegance and warm illumination.`,
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
          Bamboo Light Manufacturers in {locationName}
        </h1>
        <p className="text-black font-medium text-[10px] xs:text-xs sm:text-sm md:text-base mt-2 sm:mt-4 max-w-xs xs:max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl drop-shadow">
          Welcome To Ekotique, If You Are Looking For Bamboo Light Manufacturers in {locationName}, We Are The Best Option For You. We Manufacture Best Bamboo Light Manufacturers in {locationName}, Rattan Lights Manufacture in {locationName}, Fabric Lights Manufacture in {locationName}, India.
        </p>
    
  </div>
</div>







<div className="bg-white px-10">
  <main className="w-full px-3 xs:px-4 sm:px-6 py-6 sm:py-8 md:py-10">
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
      <section className="w-full md:w-1/2 text-black">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl leading-[1.2] font-semibold mb-3 sm:mb-4 md:mb-6 max-w-[600px]">
          Bamboo Light Manufacturers in {locationName} – Ekotique
        </h2>
        <p className="mb-4 sm:mb-6 max-w-[600px] text-xs xs:text-sm sm:text-base leading-relaxed font-normal">
          Ekotique, based in Delhi, India, is a trusted and fast-growing name among reputed <strong>Bamboo Light Manufacturers in {locationName}</strong>, offering thoughtfully designed decorative lighting solutions that blend natural aesthetics with modern elegance. Established as a Proprietorship under the ownership of Mr. Shubham Arya and Ms. Sonia Sivakumar ,Ekotique has been serving the Indian lighting market since its GST registration in 2022, delivering quality-driven products through a dedicated wholesale and distribution network across {locationName}.

          As a customer-first wholesaler and distributor, we specialize in stylish, durable, and eco-inspired lighting solutions suitable for homes, hotels, offices, cafes, showrooms, resorts, and interior decor projects. <strong>Bamboo Light Manufacturers in {locationName}</strong>, Our bamboo and decorative lighting collections are designed to enhance ambiance while reflecting refined craftsmanship and sustainable sensibilities.
        </p>
      </section>
      <div className="w-full h-[500px] md:w-1/2 flex justify-center">
        <img
          alt={`Bamboo Light Manufacturers in ${locationName}`}
          className="object-cover rounded-lg w-full max-w-[350px] xs:max-w-[400px] sm:max-w-[450px] md:max-w-[500px] h-auto shadow"
         height={300}
          src="/s1.jpeg"
        
        />
      </div>
    </div>
  </main>
</div>



<hr />




<div className="bg-white w-full px-16 xs:px-16 sm:px-16 py-6 sm:py-10 flex flex-col md:flex-row md:space-x-10 lg:space-x-20 ">
  <div className="w-full md:w-1/2 flex flex-col justify-center">
    <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl leading-[1.2] mb-3 sm:mb-6 font-semibold">
      Leading Bamboo Light Manufacturers in {locationName}
    </h2>
    <p className="text-xs xs:text-sm sm:text-base leading-relaxed max-w-xl">
      As one of the emerging <strong>Bamboo Light Manufacturers in {locationName}</strong>, Ekotique understands the rising demand for eco-friendly and aesthetically rich lighting solutions. Bamboo lights are not just a trend; they represent a lifestyle choice that values sustainability, warmth, and natural textures. Our bamboo lighting products are crafted to deliver soft illumination, artistic appeal, and long-lasting performance.
      <br />
      <br />
      Each bamboo light supplied by Ekotique is designed to complement modern, rustic, bohemian, and contemporary interior themes. Whether installed in residential spaces or commercial environments, our <strong>Bamboo Light Manufacturers in {locationName}</strong> create inviting atmospheres that elevate interior design concepts.
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
    Our Comprehensive Product Range as Bamboo Light Manufacturers in {locationName}
  </h2>
  <p className="text-xs xs:text-sm sm:text-base mt-2 sm:mt-3 leading-[1.6]  mx-auto text-center">
    At Ekotique, we offer a carefully curated and expansive range of decorative lighting solutions designed to enhance interiors with warmth, elegance, and timeless appeal. As one of the emerging <strong>Bamboo Light Manufacturers in {locationName}</strong>, our product portfolio reflects a perfect blend of natural materials, contemporary design, and functional illumination. Each lighting category is crafted or sourced with attention to quality, durability, and aesthetic harmony, making our products suitable for residential, hospitality, commercial, and interior decor projects across India.
  </p>
  <ul className="space-y-4 sm:space-y-6 text-xs xs:text-sm sm:text-base mt-4 sm:mt-5 leading-[1.6] list-none">
    <li>
      <span className="font-bold">1. Bamboo Lights Manufacture in {locationName}</span><br />
      Our bamboo lights represent the essence of eco-inspired design. Crafted using high-quality natural bamboo, these lighting fixtures bring an organic charm to interiors while providing soft, ambient illumination. The natural texture of bamboo diffuses light beautifully, creating a calming and inviting atmosphere. At <strong>Bamboo Lights Manufacture in {locationName}</strong>, Available in various shapes, sizes, and finishes, our bamboo lights seamlessly complement modern, rustic, bohemian, and minimalist interiors.<br />
      <strong>Ideal Uses:</strong> Bamboo lights are widely used in living rooms, bedrooms, cafés, resorts, restaurants, patios, villas, and eco-themed interiors where warmth and sustainability are key design elements.
    </li>
    <li>
      <span className="font-bold">2. Rattan Lights Manufacture in {locationName}</span><br />
      Rattan lights are a perfect fusion of traditional craftsmanship and modern styling. Made from flexible, durable natural fibers, these lights add depth, texture, and visual interest to any space. At <strong>Rattan Lights Manufacture in {locationName}</strong>, The woven patterns of rattan allow light to pass through softly, creating artistic shadows and enhancing the overall ambiance.<br />
      <strong>Ideal Uses:</strong> Rattan lights are popular in boutique hotels, lounges, dining spaces, designer homes, and commercial interiors where a sophisticated yet natural look is desired.
    </li>
    <li>
      <span className="font-bold">3. Fabric Lights Manufacture in {locationName}</span><br />
      Our fabric lights are designed to deliver elegance, comfort, and visual softness. Featuring premium-quality fabric shades, these lights help diffuse illumination evenly, reducing glare while enhancing the warmth of a room. At <strong>Fabric Lights Manufacture in {locationName}</strong> Available in a variety of colors, textures, and styles, fabric lights are versatile additions to both classic and contemporary interiors.<br />
      <strong>Ideal Uses:</strong> Fabric lights are commonly used in bedrooms, hotel rooms, living areas, office lounges, and hospitality spaces where subtle and comfortable lighting is essential.
    </li>
    <li>
      <span className="font-bold">4. Chandelier Lights Manufacture in {locationName}</span><br />
      Ekotique’s chandelier lights are crafted to make a bold visual statement. Designed with artistic detailing and superior finishing, our chandeliers serve as focal points that elevate the luxury and elegance of any interior. At <strong>Chandelier Lights Manufacture in {locationName}</strong> From modern minimalist chandeliers to classic decorative designs, our range caters to diverse aesthetic preferences.<br />
      <strong>Ideal Uses:</strong> Chandelier lights are ideal for hotels, banquet halls, villas, luxury residences, showrooms, reception areas, and premium commercial spaces that require dramatic and impactful lighting.
    </li>
    <li>
      <span className="font-bold">5. Custom Decorative Lighting Manufacture in {locationName}</span><br />
      In addition to our standard product range, Ekotique also offers customized decorative lighting solutions tailored to specific project requirements. At <strong>Custom Decorative Lighting Manufacture in {locationName}</strong>We work closely with interior designers, architects, and project planners to develop lighting concepts that align with unique design visions and spatial needs.<br />
      <strong>Ideal Uses:</strong> Custom lighting solutions are suited for themed interiors, hospitality projects, retail environments, and large-scale décor installations.
    </li>
  </ul>

  <div className=" bg-[#BD9975] rounded-xl p-4 sm:p-6 mt-6 max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
    <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-black mb-2 text-center">📞 Contact us today to discuss your requirements, request a quote, or place an order.</h3>
  <p className="text-xs xs:text-sm sm:text-base text-black mb-2 text-center">If you are Looking for the <strong>Best Bamboo Light Manufacturers in {locationName}</strong>? Ekotique is your trusted partner.</p> <br/> 
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
        As reliable <strong>Bamboo Light Manufacturers in {locationName}</strong>, our products are widely used across:<br/><br/>
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
  Why Bamboo Lighting Is in High Demand
      </h2>
            <p>
        Bamboo lighting has become increasingly popular due to its environment-friendly nature, unique visual appeal, and versatile usability. Interior designers and homeowners prefer bamboo lights for their ability to diffuse light softly, creating cozy and elegant spaces. Bamboo is lightweight, renewable, and durable, making it ideal for decorative lighting solutions across diverse applications.<br/><br/>

As experienced <strong>Bamboo Light Manufacturers in {locationName}</strong>, Ekotique ensures that each product meets aesthetic expectations while maintaining structural integrity and safety standards.
      </p>
      
    </div>
  </div>11
</div>





<div className="w-full mx-auto px-16 xs:px-16 sm:px-16 py-6 sm:py-8 md:py-10">
  <h2 className="text-center mx-auto text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif leading-[1.2] mb-4 sm:mb-6 text-black max-w-2xl sm:max-w-3xl md:max-w-4xl">
    Why Choose Ekotique – Bamboo Light Manufacturers in {locationName}
  </h2>
  <p className="text-xs xs:text-sm sm:text-base mt-2 sm:mt-3 leading-[1.6]  mx-auto text-center">
    Below are the key reasons why businesses and interior professionals trust Ekotique for premium decorative lighting and bamboo lighting solutions across India:
  </p>
  <ul className="space-y-4 sm:space-y-6 text-xs xs:text-sm sm:text-base mt-4 sm:mt-5 leading-[1.6] list-none">
    <li>
      <span className="font-bold">1. Premium Quality & Finishing</span><br />
      We source and supply lighting products that meet high standards of durability, design, and finish. Each piece reflects careful attention to detail and material quality.
    </li>
    <li>
      <span className="font-bold">2. Eco-Friendly Design Philosophy</span><br />
      Our bamboo and rattan lighting collections support sustainable living by promoting renewable materials and natural aesthetics.
    </li>
    <li>
      <span className="font-bold">3. Wholesale & Bulk Supply Expertise</span><br />
      As a wholesaler and distributor, we efficiently manage bulk orders and ensure smooth distribution across India through our dedicated sales setup.
    </li>
    <li>
      <span className="font-bold">4. Wide Decorative Lighting Range</span><br />
      From bamboo and rattan lights to fabric and chandelier lighting, we offer a diverse product portfolio to meet varied décor needs.
    </li>
    <li>
      <span className="font-bold">5. Customer-Centric Approach</span><br />
      At Ekotique, customer satisfaction is our priority. We focus on timely delivery, transparent communication, and consistent product quality.
    </li>
    <li>
      <span className="font-bold">6. Trusted Bamboo Light Manufacturers in {locationName}</span><br />
      Our growing reputation as dependable <strong>Bamboo Light Manufacturers in {locationName}</strong> is built on reliability, product excellence, and long-term business relationships.
    </li>
  </ul>
</div>

<hr />
<div className="w-full mx-auto px-16 xs:px-16 sm:px-16 py-6 sm:py-8 md:py-10">
  <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif mb-2 sm:mb-4">Conclusion:-</h2>
  <p className="text-xs xs:text-sm sm:text-base font-sans text-black leading-relaxed">
    If you are looking for trusted and quality-driven <strong>Bamboo Light Manufacturers in {locationName}</strong>, Ekotique is your ideal partner. Our eco-inspired decorative lighting solutions combine natural beauty, modern design, and lasting durability. From bamboo and rattan lights to fabric shades and chandeliers, we offer lighting that transforms spaces into visually stunning environments.

    Choose Ekotique for lighting solutions that illuminate with elegance, sustainability, and style.
  </p>
</div>

    </main>
  );
}
