import styles from "./answer.module.scss";

export function Answer({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <div className={styles.answer} onClick={onPress}>
      {title}
    </div>
  );
}
