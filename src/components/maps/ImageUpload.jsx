import placeholder from "../../assets/imgs/placeholder.png";
import { useEffect, useRef, useState } from "react";

export default function ImageUpload(props) {
  const file = useRef();
  const preview = useRef();
  const [image, setImage] = useState(placeholder);

  useEffect(() => {
    if (props.body.attributes.Thumbnail !== "") {
      setImage(props.body.attributes.Thumbnail);
    }
  }, [props.body.attributes.Thumbnail]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        let d = props.body;
        d.attributes.Thumbnail = e.target.result;
        props.updateBody(d);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const getFile = () => {
    file.current.click();
  };

  return (
    <div className="photo">
      {!props.preview ? (
        <>
          <h3>Upload a thumbnail</h3>
          <p>
            This image will be used as a thumbnail for this map instance. It
            should, therefore, represent the intended theme of the map instance.
          </p>
        </>
      ) : (
        <h3>Map Thumbnail</h3>
      )}
      <div className="img">
        <img ref={preview} src={image} alt="" />
        <input
          ref={file}
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={(e) => onImageChange(e)}
        />
        {!props.preview && (
          <i
            className="fa fa-plus"
            onClick={() => {
              getFile();
            }}
          ></i>
        )}
      </div>
    </div>
  );
}
