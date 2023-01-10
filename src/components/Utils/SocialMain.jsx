import trImg from "../../assets/imgs/twitter.png";
import fbImg from "../../assets/imgs/facebook.png";
import igImg from "../../assets/imgs/instagram.png";
import lnImg from "../../assets/imgs/linkedin.png"

export default function SocialMain(props) {
  let links = {}
  links.facebook='https://www.facebook.com/KenyaSpaceAgencyOfficial'
  links.instagram='https://www.instagram.com/kenya_space_agency/'
  links.twitter='https://twitter.com/SpaceAgencyKE'
  links.linkedin='https://www.linkedin.com/company/kenya-space-agency-official'
  links.youtube='https://www.youtube.com/channel/UCW-ZIdWie7hAhWgX24AMtQA'
  links.whatsapp='#whatsapp'

  return (
    <div className="social">
      <img onClick={()=>{ window.location.href = `${links.facebook}`}} src={fbImg} alt="" />
      <img onClick={()=>{ window.location.href = `${links.instagram}`}} src={igImg} alt="" />
      <img onClick={()=>{ window.location.href = `${links.twitter}`}} src={trImg} alt="" />
      <img onClick={()=>{ window.location.href = `${links.linkedin}`}} src={lnImg} alt="" />
      
      {/* <img onClick={()=>{ window.location.href = `${links.whatsapp}`}} src={wpImg} alt="" /> */}
      {/* <img src={ytImg} alt="" /> */}
      

    </div>
  );
}
