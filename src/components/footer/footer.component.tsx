import { Container, Link, Text, useTheme } from "@nextui-org/react";
import styles from "./footer.module.scss";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={styles.footer}
      style={{ boxShadow: theme?.shadows.lg.value }}
    >
      <Container className={styles.footer}>
        <Text>
          Made by
          <Link block href={import.meta.env.VITE_AUTHOR_URL} target="_blank">
            {import.meta.env.VITE_AUTHOR}
          </Link>
        </Text>
      </Container>
    </footer>
  );
}
