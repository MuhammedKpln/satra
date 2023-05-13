import { Button, Card, Grid, Text } from "@nextui-org/react";

interface IProps {
  title: string;
  description: string;
  buttonTitle: string;
  onClick: () => void;
}

export function SelectTestCard(props: IProps) {
  const { title, description, buttonTitle, onClick } = props;

  return (
    <Card css={{ p: "$6", mw: "400px" }}>
      <Card.Header>
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <Text h4 css={{ lineHeight: "$xs" }}>
              {title}
            </Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2" }}>
        <Text>{description}</Text>
      </Card.Body>
      <Card.Footer>
        <Button onPress={onClick}>{buttonTitle}</Button>
      </Card.Footer>
    </Card>
  );
}
