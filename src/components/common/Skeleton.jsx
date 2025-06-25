import styles from "./Skeleton.module.css";

const Skeleton = ({ count = 1, className = "" }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className={`${styles.skeleton} ${className}`}>
            ‌
          </div>
        ))}
    </>
  );
};

export default Skeleton;
