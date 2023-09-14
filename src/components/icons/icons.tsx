export interface IRestProps {
  [restProps: string]: any;
}
interface IIconProps extends Omit<IRestProps, 'restProps'> {
  type: string;
}

const IconSVG: React.FC<IIconProps> = (props) => {
  switch (props.type) {
    case 'search':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20.5022 20.091L16.1592 15.748M16.1592 15.748C16.902 15.0051 17.4913 14.1232 17.8934 13.1526C18.2954 12.1819 18.5024 11.1416 18.5024 10.091C18.5024 9.04042 18.2954 8.00011 17.8934 7.02948C17.4913 6.05885 16.902 5.17691 16.1592 4.43403C15.4163 3.69114 14.5343 3.10185 13.5637 2.6998C12.5931 2.29775 11.5528 2.09082 10.5022 2.09082C9.45156 2.09082 8.41124 2.29775 7.44061 2.6998C6.46998 3.10185 5.58805 3.69114 4.84516 4.43403C3.34483 5.93436 2.50195 7.96924 2.50195 10.091C2.50195 12.2128 3.34483 14.2477 4.84516 15.748C6.34549 17.2484 8.38037 18.0912 10.5022 18.0912C12.6239 18.0912 14.6588 17.2484 16.1592 15.748Z"
            stroke="#702A14"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );

    default:
      return null;
  }
};

export default IconSVG;
