import "./cursor.css";

const Cursor = ({ x, y }) => {
  return <div className="cursor" style={{ top: y, left: x }}></div>;
};

export default Cursor;
