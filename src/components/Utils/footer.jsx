import React from "react";
import FooterItem from "./footerItem";
import pdf from "../../assets/Doc/Public Portal Documentation.pdf";


class Footer extends React.Component {

  render() {
    return (
      <div className="footer" id="footer">
        <div className="overlay"></div>
        <div className="container">
          <FooterItem
            title="Kenya Space Agency"
            info="Promote, coordinate and regulate space related actiities in kenya"
          />
          <FooterItem
            title="Sitemap"
            i1="Home"
            link1="/"
            i2="Browse Data"
            link2="/data"
            i3="About"
            link3="/about"
            i4="Publications & Reports"
            link4="/publications"
            i5="User Manual"
            link5={pdf}
          />
          <FooterItem
            title="LEGAL"
            i1="Terms and Conditions"
            link1="/terms"
            i2="Privacy Policy"
            link2="/privacypolicy"
          />
          <FooterItem
            title="Quick Links"
            i1="FAQs"
            link1="/faqs"
          />
          <FooterItem
            title="CONTACTS"
            mail="gisimagery@ksa.go.ke"
            num1="+254 709 298 200"
            num2="+254 733 000 000"
            social={true}
          />
        </div>
        <span className="copyright">Copyright 2022. All rights reserved.</span>
      </div>
    );
  }
}

export default Footer;
