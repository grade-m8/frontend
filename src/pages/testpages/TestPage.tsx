interface Props {
  informativeText: string;
}

export default function TestPage(props: Props) {
  return <h1>{props.informativeText}</h1>;
}
