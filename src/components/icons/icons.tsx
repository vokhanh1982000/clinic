export interface IRestProps {
  [restProps: string]: any;
}
interface IIconProps extends Omit<IRestProps, 'restProps'> {
  type: string;
}

const IconSVG: React.FC<IIconProps> = (props) => {
  switch (props.type) {
    case 'bokking':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.7159 22.0623H4.625C3.52043 22.0623 2.625 21.1668 2.625 20.0623V6.06226C2.625 4.95769 3.52043 4.06226 4.625 4.06226H18.625C19.7296 4.06226 20.625 4.95769 20.625 6.06226V13.6532"
            stroke="#702A14"
            stroke-width="1.09102"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.6255 2.0625V6.0625"
            stroke="#702A14"
            stroke-width="1.09102"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.62451 2.0625V6.0625"
            stroke="#702A14"
            stroke-width="1.09102"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.625 10.0623H20.625"
            stroke="#702A14"
            stroke-width="1.09102"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17.6245 22.6681C20.1349 22.6681 22.17 20.633 22.17 18.1226C22.17 15.6121 20.1349 13.5771 17.6245 13.5771C15.1141 13.5771 13.079 15.6121 13.079 18.1226C13.079 20.633 15.1141 22.6681 17.6245 22.6681Z"
            stroke="#702A14"
            stroke-width="1.09102"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17.4243 16.7229V19.1229L19.0243 19.9229"
            stroke="#702A14"
            stroke-width="1.09102"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    case 'user':
      return (
        <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M68.2961 85.9199H25.6984C23.1015 85.9199 20.6109 84.8883 18.7747 83.052C16.9384 81.2157 15.9067 78.7252 15.9067 76.1283V72.8892C15.9067 57.3439 29.854 44.6892 46.9972 44.6892C64.1405 44.6892 78.0877 57.3361 78.0877 72.8892V76.1283C78.0877 78.7252 77.0561 81.2157 75.2198 83.052C73.3835 84.8883 70.893 85.9199 68.2961 85.9199ZM46.9972 48.6137C32.0121 48.6137 19.8234 59.502 19.8234 72.897V76.1361C19.8234 77.6942 20.4424 79.1886 21.5442 80.2903C22.6459 81.3921 24.1403 82.0111 25.6984 82.0111H68.2961C69.8542 82.0111 71.3485 81.3921 72.4503 80.2903C73.5521 79.1886 74.1711 77.6942 74.1711 76.1361V72.8892C74.1711 59.502 61.9824 48.6137 46.9972 48.6137ZM46.9972 38.8181C43.9574 38.8189 40.9855 37.9181 38.4576 36.2298C35.9297 34.5415 33.9592 32.1415 32.7953 29.3333C31.6315 26.525 31.3266 23.4347 31.9192 20.4531C32.5117 17.4716 33.9752 14.7327 36.1244 12.5829C38.2736 10.4332 41.0121 8.96902 43.9935 8.37568C46.9749 7.78235 50.0653 8.08648 52.8739 9.24961C55.6824 10.4127 58.083 12.3826 59.7719 14.9101C61.4608 17.4376 62.3623 20.4092 62.3623 23.4491C62.3592 27.5236 60.7395 31.4303 57.8588 34.3118C54.9781 37.1932 51.0717 38.8139 46.9972 38.8181ZM46.9972 12.0007C44.7318 11.9999 42.5171 12.671 40.6332 13.9291C38.7493 15.1872 37.2808 16.9758 36.4135 19.0686C35.5462 21.1614 35.3191 23.4644 35.7608 25.6863C36.2026 27.9082 37.2934 29.9492 38.8953 31.551C40.4972 33.1529 42.5381 34.2437 44.76 34.6855C46.9819 35.1272 49.2849 34.9001 51.3777 34.0328C53.4705 33.1655 55.2591 31.6971 56.5172 29.8131C57.7753 27.9292 58.4464 25.7145 58.4457 23.4491C58.4425 20.4137 57.2354 17.5036 55.0891 15.3573C52.9427 13.2109 50.0326 12.0038 46.9972 12.0007Z"
            fill="#CCCCCC"
          />
        </svg>
      );
    case 'camera':
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M34.125 9.51563H29.4016L27.0703 6.01617C26.9803 5.88121 26.8583 5.7706 26.7151 5.69417C26.572 5.61775 26.4122 5.57789 26.25 5.57813H15.75C15.5878 5.57789 15.428 5.61775 15.2849 5.69417C15.1417 5.7706 15.0197 5.88121 14.9297 6.01617L12.5967 9.51563H7.875C6.91773 9.51563 5.99968 9.8959 5.32279 10.5728C4.6459 11.2497 4.26563 12.1677 4.26562 13.125V31.5C4.26563 32.4573 4.6459 33.3753 5.32279 34.0522C5.99968 34.7291 6.91773 35.1094 7.875 35.1094H34.125C35.0823 35.1094 36.0003 34.7291 36.6772 34.0522C37.3541 33.3753 37.7344 32.4573 37.7344 31.5V13.125C37.7344 12.1677 37.3541 11.2497 36.6772 10.5728C36.0003 9.8959 35.0823 9.51563 34.125 9.51563ZM35.7656 31.5C35.7656 31.9351 35.5928 32.3524 35.2851 32.6601C34.9774 32.9678 34.5601 33.1406 34.125 33.1406H7.875C7.43988 33.1406 7.02258 32.9678 6.7149 32.6601C6.40723 32.3524 6.23438 31.9351 6.23438 31.5V13.125C6.23438 12.6899 6.40723 12.2726 6.7149 11.9649C7.02258 11.6572 7.43988 11.4844 7.875 11.4844H13.125C13.2872 11.4846 13.447 11.4448 13.5901 11.3683C13.7333 11.2919 13.8553 11.1813 13.9453 11.0463L16.2766 7.54688H25.7217L28.0547 11.0463C28.1447 11.1813 28.2667 11.2919 28.4099 11.3683C28.553 11.4448 28.7128 11.4846 28.875 11.4844H34.125C34.5601 11.4844 34.9774 11.6572 35.2851 11.9649C35.5928 12.2726 35.7656 12.6899 35.7656 13.125V31.5ZM21 14.7656C19.6372 14.7656 18.3049 15.1698 17.1718 15.9269C16.0386 16.6841 15.1554 17.7602 14.6339 19.0193C14.1124 20.2784 13.9759 21.6639 14.2418 23.0005C14.5077 24.3372 15.1639 25.565 16.1276 26.5287C17.0913 27.4923 18.3191 28.1486 19.6557 28.4145C20.9924 28.6803 22.3778 28.5439 23.6369 28.0224C24.896 27.5008 25.9722 26.6176 26.7293 25.4845C27.4865 24.3513 27.8906 23.0191 27.8906 21.6563C27.8906 19.8287 27.1646 18.0761 25.8724 16.7838C24.5802 15.4916 22.8275 14.7656 21 14.7656ZM21 26.5781C20.0265 26.5781 19.075 26.2895 18.2656 25.7486C17.4562 25.2078 16.8253 24.4391 16.4528 23.5398C16.0803 22.6404 15.9828 21.6508 16.1727 20.696C16.3626 19.7413 16.8314 18.8643 17.5197 18.176C18.208 17.4876 19.085 17.0189 20.0398 16.8289C20.9945 16.639 21.9842 16.7365 22.8835 17.109C23.7829 17.4816 24.5516 18.1124 25.0924 18.9218C25.6332 19.7312 25.9219 20.6828 25.9219 21.6563C25.9219 22.9616 25.4033 24.2135 24.4803 25.1365C23.5573 26.0596 22.3054 26.5781 21 26.5781Z"
            fill="#702A14"
          />
        </svg>
      );
    case 'specialized':
      return (
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.21087 5.52797C4.20354 5.16501 4.18154 4.3291 4.16321 4.04313C4.16321 3.06057 4.41618 1.06979 6.25298 1.06246C6.83958 1.06246 6.6746 0.666504 7.80381 0.666504C11.2574 0.666504 11.5434 2.95425 11.5434 4.04313C11.5104 4.31077 11.5031 5.13568 11.4994 5.53163"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linejoin="round"
          />
          <path
            d="M7.85022 10.1549C8.04087 10.1549 8.15086 10.1439 8.29751 10.1219C8.33784 10.1146 8.3635 10.1109 8.3635 10.1109C8.69347 10.0632 8.96477 10.0193 9.23974 9.81394C9.38639 9.70396 9.53304 9.5793 9.67602 9.44365C10.0866 9.05869 10.4643 8.60408 10.6696 8.21545L10.9482 7.4602C10.9739 7.38688 11.0215 7.32089 11.0802 7.26589C11.6081 6.79294 11.9528 5.71873 11.3662 5.44743C11.3662 5.44743 11.1242 5.57575 10.9372 5.31178C10.8346 5.16879 10.7136 4.95981 10.6512 4.66651C10.6366 4.60419 10.5779 4.56386 10.5156 4.57486C8.29384 4.90482 6.57803 3.77194 6.02809 3.34299C5.98043 3.30633 5.92177 3.29533 5.86311 3.31C5.80445 3.32466 5.74579 3.36132 5.73479 3.41998C5.68713 3.68395 5.62114 3.93326 5.53681 4.1679C5.33884 4.72517 5.10053 5.10646 4.7559 5.46942C4.56892 5.6674 4.32328 5.45476 4.32328 5.45476C3.74035 5.72606 4.08497 6.80028 4.60925 7.27322C4.66791 7.32455 4.7119 7.39054 4.74123 7.46754L5.01987 8.22279C5.22518 8.61141 5.59914 9.06603 6.01343 9.45098C6.15641 9.58297 6.30306 9.71129 6.44971 9.82128C6.72468 10.0266 6.99599 10.0706 7.32595 10.1182C7.32595 10.1182 7.35161 10.1219 7.39194 10.1292C7.54959 10.1439 7.65958 10.1549 7.85022 10.1549Z"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linejoin="round"
          />
          <path
            d="M9.72412 9.40723C9.75345 9.94617 9.78278 10.5328 9.88177 10.9434L13.7827 12.4319C14.164 12.5859 14.4609 12.8828 14.5929 13.2458C14.8019 13.8287 15.0879 15.6325 15.2418 17.253"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linejoin="round"
          />
          <path
            d="M5.82336 10.9431L7.24954 11.6654C7.63083 11.8597 8.07812 11.8597 8.45941 11.6654L9.88558 10.9431"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linejoin="round"
          />
          <path
            d="M0.5 17.2567C0.653983 15.6325 0.939951 13.8251 1.14893 13.2458C1.28091 12.8828 1.57055 12.5859 1.95184 12.4319L5.79775 10.9434C5.89674 10.5328 5.9554 9.94617 5.98473 9.40723"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linejoin="round"
          />
          <path
            d="M5.05385 13.8909C4.71288 13.0696 4.60656 12.1934 4.84487 11.3135"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linejoin="round"
          />
          <path
            d="M6.09843 14.4407C6.09843 14.8074 5.7978 15.1043 5.43118 15.1043C5.06088 15.1043 4.76392 14.8074 4.76392 14.4407C4.76392 14.0741 5.06455 13.7771 5.43118 13.7771C5.80147 13.7735 6.09843 14.0741 6.09843 14.4407Z"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linejoin="round"
          />
          <path
            d="M10.8975 11.332C11.0331 11.8563 11.0221 12.3952 10.9451 12.9012"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linejoin="round"
          />
          <path
            d="M9.20015 16.3324L9.0975 16.7357C8.71987 16.6551 8.40091 16.2958 8.5109 15.9401L9.29181 13.7844C9.54112 13.1428 10.1314 12.7175 10.9086 12.8898C11.6859 13.0585 12.0122 13.6817 11.9242 14.36L11.5832 16.6111C11.5099 16.974 11.0516 17.1647 10.674 17.0804L10.7766 16.6771"
            stroke="#999999"
            stroke-width="0.930417"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    case 'search':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20.5022 20.091L16.1592 15.748M16.1592 15.748C16.902 15.0051 17.4913 14.1232 17.8934 13.1526C18.2954 12.1819 18.5024 11.1416 18.5024 10.091C18.5024 9.04042 18.2954 8.00011 17.8934 7.02948C17.4913 6.05885 16.902 5.17691 16.1592 4.43403C15.4163 3.69114 14.5343 3.10185 13.5637 2.6998C12.5931 2.29775 11.5528 2.09082 10.5022 2.09082C9.45156 2.09082 8.41124 2.29775 7.44061 2.6998C6.46998 3.10185 5.58805 3.69114 4.84516 4.43403C3.34483 5.93436 2.50195 7.96924 2.50195 10.091C2.50195 12.2128 3.34483 14.2477 4.84516 15.748C6.34549 17.2484 8.38037 18.0912 10.5022 18.0912C12.6239 18.0912 14.6588 17.2484 16.1592 15.748Z"
            stroke="#702A14"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'create':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 16.0952H24.1905"
            stroke="white"
            strokeWidth="1.60377"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.0956 8V24.1905"
            stroke="white"
            strokeWidth="1.60377"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'create-2':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 7.07129H13.1429"
            stroke="#EE5824"
            strokeWidth="1.20283"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.07227 1V13.1429"
            stroke="#EE5824"
            strokeWidth="1.20283"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'edit':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.1564 5.80899C21.111 5.9768 21.0929 6.16274 21.0067 6.3124C20.8616 6.57091 20.7119 6.84756 20.5079 7.05164C17.8684 9.70927 15.2153 12.3533 12.5667 14.9973C12.4715 15.0926 12.34 15.1697 12.2084 15.2059C10.993 15.5506 9.77757 15.8862 8.56213 16.2218C8.09501 16.3488 7.80929 16.0676 7.93627 15.605C8.27188 14.3896 8.60748 13.1742 8.95216 11.9587C8.98844 11.8272 9.06554 11.6957 9.16078 11.6005C11.8048 8.94736 14.4579 6.28973 17.111 3.64117C17.9727 2.78401 19.2063 2.78855 20.0679 3.64117C20.2176 3.79083 20.3673 3.94049 20.5215 4.09015C20.8435 4.41215 21.0566 4.79311 21.1247 5.24663C21.1292 5.2693 21.1428 5.28745 21.1519 5.31012C21.1564 5.47792 21.1564 5.64119 21.1564 5.80899ZM12.2039 14.0495C14.3899 11.8635 16.5804 9.67299 18.7573 7.49609C18.0634 6.8022 17.3604 6.09925 16.6665 5.40536C14.4896 7.58226 12.2946 9.7773 10.1132 11.9587C10.8025 12.6481 11.5055 13.3465 12.2039 14.0495ZM17.3604 4.66612C18.0815 5.38722 18.7845 6.09018 19.4965 6.8022C19.6507 6.63894 19.8412 6.46206 20.009 6.26251C20.331 5.87702 20.3446 5.27384 20.0135 4.88835C19.7868 4.62077 19.5328 4.3668 19.2652 4.14004C18.8843 3.81804 18.2901 3.83164 17.9092 4.14911C17.7006 4.32145 17.5192 4.51646 17.3604 4.66612ZM8.99751 15.1651C9.79117 14.9429 10.5576 14.7343 11.3014 14.5257C10.739 13.9633 10.1857 13.4145 9.63698 12.8612C9.42836 13.605 9.2152 14.3715 8.99751 15.1651Z"
            fill="#702A14"
            stroke="#702A14"
            strokeWidth="0.2"
          />
          <path
            d="M11.6051 21.0654C9.51891 21.0654 7.43271 21.0654 5.34652 21.0654C4.35784 21.0654 3.62768 20.63 3.21497 19.732C3.08799 19.4509 3.01089 19.1198 3.01089 18.8114C2.99728 14.8748 2.99728 10.9473 3.00635 7.01532C3.01089 5.78628 3.94514 4.80668 5.17872 4.77493C6.53474 4.74319 7.8953 4.76133 9.25587 4.76586C9.53251 4.76586 9.73206 4.96541 9.73206 5.21031C9.73206 5.46428 9.52344 5.66383 9.24226 5.66383C7.94066 5.66383 6.64359 5.66383 5.34198 5.66383C4.63903 5.66383 4.13108 6.04479 3.95875 6.70239C3.92246 6.84299 3.91339 6.99265 3.91339 7.14231C3.90886 10.9882 3.90886 14.834 3.91339 18.6799C3.91339 19.4146 4.27167 19.9225 4.92474 20.1039C5.06534 20.1447 5.215 20.1583 5.36012 20.1583C9.52798 20.1629 13.6913 20.1629 17.8592 20.1583C18.5666 20.1583 19.0837 19.7865 19.2605 19.1379C19.3013 18.9883 19.315 18.825 19.315 18.6663C19.3195 17.3919 19.315 16.1129 19.3195 14.8386C19.3195 14.5392 19.51 14.3351 19.7775 14.3397C20.0043 14.3442 20.1948 14.5211 20.2129 14.7478C20.222 14.8522 20.2175 14.961 20.2175 15.0653C20.2175 16.3488 20.2311 17.6277 20.2084 18.9112C20.1902 20.054 19.2288 21.0246 18.0859 21.0472C16.7707 21.0745 15.451 21.0563 14.1312 21.0609C13.2831 21.0654 12.4441 21.0654 11.6051 21.0654Z"
            fill="#702A14"
            stroke="#702A14"
            strokeWidth="0.2"
          />
        </svg>
      );

    case 'delete':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.72742 5.21814H13.1092C13.1092 4.76969 12.9311 4.3396 12.614 4.02249C12.2969 3.70538 11.8668 3.52724 11.4183 3.52724C10.9699 3.52724 10.5398 3.70538 10.2227 4.02249C9.90557 4.3396 9.72742 4.76969 9.72742 5.21814ZM8.60015 5.21814C8.60015 4.47072 8.89706 3.7539 9.42557 3.22539C9.95408 2.69688 10.6709 2.39996 11.4183 2.39996C12.1658 2.39996 12.8826 2.69688 13.4111 3.22539C13.9396 3.7539 14.2365 4.47072 14.2365 5.21814H19.8729C20.0224 5.21814 20.1657 5.27753 20.2714 5.38323C20.3771 5.48893 20.4365 5.6323 20.4365 5.78178C20.4365 5.93127 20.3771 6.07463 20.2714 6.18033C20.1657 6.28603 20.0224 6.34542 19.8729 6.34542H18.6847L17.3388 18.0059C17.2436 18.8302 16.8488 19.5907 16.2294 20.1428C15.61 20.6948 14.8092 20.9999 13.9795 21H8.85716C8.02744 20.9999 7.22669 20.6948 6.60728 20.1428C5.98787 19.5907 5.59303 18.8302 5.49789 18.0059L4.15193 6.34542H2.96378C2.8143 6.34542 2.67093 6.28603 2.56523 6.18033C2.45953 6.07463 2.40015 5.93127 2.40015 5.78178C2.40015 5.6323 2.45953 5.48893 2.56523 5.38323C2.67093 5.27753 2.8143 5.21814 2.96378 5.21814H8.60015ZM6.61727 17.8774C6.68088 18.4268 6.94423 18.9337 7.35724 19.3016C7.77024 19.6695 8.30407 19.8728 8.85716 19.8727H13.9795C14.5326 19.8728 15.0664 19.6695 15.4794 19.3016C15.8924 18.9337 16.1558 18.4268 16.2194 17.8774L17.5496 6.34542H5.28709L6.61727 17.8774ZM9.72742 9.1636C9.8769 9.1636 10.0203 9.22298 10.126 9.32868C10.2317 9.43439 10.2911 9.57775 10.2911 9.72724V16.4909C10.2911 16.6404 10.2317 16.7837 10.126 16.8894C10.0203 16.9951 9.8769 17.0545 9.72742 17.0545C9.57793 17.0545 9.43457 16.9951 9.32887 16.8894C9.22317 16.7837 9.16378 16.6404 9.16378 16.4909V9.72724C9.16378 9.57775 9.22317 9.43439 9.32887 9.32868C9.43457 9.22298 9.57793 9.1636 9.72742 9.1636ZM13.6729 9.72724C13.6729 9.57775 13.6135 9.43439 13.5078 9.32868C13.4021 9.22298 13.2587 9.1636 13.1092 9.1636C12.9598 9.1636 12.8164 9.22298 12.7107 9.32868C12.605 9.43439 12.5456 9.57775 12.5456 9.72724V16.4909C12.5456 16.6404 12.605 16.7837 12.7107 16.8894C12.8164 16.9951 12.9598 17.0545 13.1092 17.0545C13.2587 17.0545 13.4021 16.9951 13.5078 16.8894C13.6135 16.7837 13.6729 16.6404 13.6729 16.4909V9.72724Z"
            fill="#702A14"
          />
        </svg>
      );

    case 'close':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.281 14.2193C15.3507 14.289 15.406 14.3717 15.4437 14.4628C15.4814 14.5538 15.5008 14.6514 15.5008 14.7499C15.5008 14.8485 15.4814 14.9461 15.4437 15.0371C15.406 15.1281 15.3507 15.2109 15.281 15.2806C15.2114 15.3502 15.1286 15.4055 15.0376 15.4432C14.9465 15.4809 14.849 15.5003 14.7504 15.5003C14.6519 15.5003 14.5543 15.4809 14.4632 15.4432C14.3722 15.4055 14.2895 15.3502 14.2198 15.2806L8.00042 9.06024L1.78104 15.2806C1.64031 15.4213 1.44944 15.5003 1.25042 15.5003C1.05139 15.5003 0.860523 15.4213 0.719792 15.2806C0.579062 15.1398 0.5 14.949 0.5 14.7499C0.5 14.5509 0.579062 14.36 0.719792 14.2193L6.9401 7.99993L0.719792 1.78055C0.579062 1.63982 0.5 1.44895 0.5 1.24993C0.5 1.05091 0.579062 0.860034 0.719792 0.719304C0.860523 0.578573 1.05139 0.499512 1.25042 0.499512C1.44944 0.499512 1.64031 0.578573 1.78104 0.719304L8.00042 6.93962L14.2198 0.719304C14.3605 0.578573 14.5514 0.499512 14.7504 0.499512C14.9494 0.499512 15.1403 0.578573 15.281 0.719304C15.4218 0.860034 15.5008 1.05091 15.5008 1.24993C15.5008 1.44895 15.4218 1.63982 15.281 1.78055L9.06073 7.99993L15.281 14.2193Z"
            fill="#808080"
          />
        </svg>
      );

    case 'close-modal':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0.626926 0.627232C0.814426 0.439965 1.06859 0.334779 1.33359 0.334779C1.59859 0.334779 1.85276 0.439965 2.04026 0.627232L9.00026 7.58723L15.9603 0.627232C16.0825 0.495599 16.238 0.399371 16.4103 0.348686C16.5826 0.298 16.7654 0.294734 16.9395 0.339231C17.1135 0.383729 17.2723 0.474343 17.3992 0.601526C17.526 0.728709 17.6162 0.887752 17.6603 1.0619C17.7048 1.23573 17.7017 1.41836 17.6513 1.59058C17.6008 1.7628 17.5049 1.91824 17.3736 2.04057L10.4136 9.00056L17.3736 15.9606C17.5052 16.0828 17.6015 16.2383 17.6521 16.4106C17.7028 16.5829 17.7061 16.7657 17.6616 16.9398C17.6171 17.1138 17.5265 17.2726 17.3993 17.3995C17.2721 17.5263 17.1131 17.6165 16.9389 17.6606C16.7651 17.7051 16.5825 17.702 16.4102 17.6516C16.238 17.6011 16.0826 17.5052 15.9603 17.3739L9.00026 10.4139L2.04026 17.3739C1.85058 17.5504 1.59984 17.6466 1.34075 17.6421C1.08166 17.6376 0.834397 17.5329 0.650926 17.3499C0.467935 17.1664 0.363195 16.9192 0.358719 16.6601C0.354243 16.401 0.450381 16.1502 0.626926 15.9606L7.58693 9.00056L0.626926 2.04057C0.439659 1.85307 0.334473 1.5989 0.334473 1.3339C0.334473 1.0689 0.439659 0.814733 0.626926 0.627232Z"
            fill="#1A1A1A"
          />
        </svg>
      );

    case 'location':
      return (
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.00005 16.6571L7.601 15.9799C8.28291 15.199 8.89624 14.458 9.44196 13.7532L9.89243 13.159C11.7734 10.6247 12.7143 8.61324 12.7143 7.12657C12.7143 3.95324 10.1562 1.38086 7.00005 1.38086C3.84386 1.38086 1.28577 3.95324 1.28577 7.12657C1.28577 8.61324 2.22672 10.6247 4.10767 13.159L4.55815 13.7532C5.33666 14.7508 6.15117 15.7187 7.00005 16.6571Z"
            stroke="#999999"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.00009 9.47626C8.31506 9.47626 9.38105 8.41027 9.38105 7.09531C9.38105 5.78034 8.31506 4.71436 7.00009 4.71436C5.68513 4.71436 4.61914 5.78034 4.61914 7.09531C4.61914 8.41027 5.68513 9.47626 7.00009 9.47626Z"
            stroke="#999999"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'active':
      return (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="4" fill="#20BF6B" />
        </svg>
      );

    case 'inactive':
      return (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="4" fill="#D63A3A" />
        </svg>
      );

    case 'more':
      return (
        <svg width="14" height="4" viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.25 2C3.25 2.39782 3.09196 2.77936 2.81066 3.06066C2.52936 3.34196 2.14782 3.5 1.75 3.5C1.35218 3.5 0.970644 3.34196 0.68934 3.06066C0.408035 2.77936 0.25 2.39782 0.25 2C0.25 1.60218 0.408035 1.22064 0.68934 0.93934C0.970644 0.658036 1.35218 0.5 1.75 0.5C2.14782 0.5 2.52936 0.658036 2.81066 0.93934C3.09196 1.22064 3.25 1.60218 3.25 2ZM8.5 2C8.5 2.39782 8.34196 2.77936 8.06066 3.06066C7.77936 3.34196 7.39782 3.5 7 3.5C6.60218 3.5 6.22064 3.34196 5.93934 3.06066C5.65804 2.77936 5.5 2.39782 5.5 2C5.5 1.60218 5.65804 1.22064 5.93934 0.93934C6.22064 0.658036 6.60218 0.5 7 0.5C7.39782 0.5 7.77936 0.658036 8.06066 0.93934C8.34196 1.22064 8.5 1.60218 8.5 2ZM13.75 2C13.75 2.39782 13.592 2.77936 13.3107 3.06066C13.0294 3.34196 12.6478 3.5 12.25 3.5C11.8522 3.5 11.4706 3.34196 11.1893 3.06066C10.908 2.77936 10.75 2.39782 10.75 2C10.75 1.60218 10.908 1.22064 11.1893 0.93934C11.4706 0.658036 11.8522 0.5 12.25 0.5C12.6478 0.5 13.0294 0.658036 13.3107 0.93934C13.592 1.22064 13.75 1.60218 13.75 2Z"
            fill="#333333"
          />
        </svg>
      );

    case 'specialist':
      return (
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.33329 8.33398C4.44924 8.33398 3.60139 7.9828 2.97627 7.35767C2.35115 6.73255 1.99996 5.88471 1.99996 5.00065V2.33398C1.99996 2.15717 2.0702 1.9876 2.19522 1.86258C2.32025 1.73756 2.48981 1.66732 2.66663 1.66732H3.33329C3.5101 1.66732 3.67967 1.59708 3.8047 1.47206C3.92972 1.34703 3.99996 1.17746 3.99996 1.00065C3.99996 0.82384 3.92972 0.654271 3.8047 0.529246C3.67967 0.404222 3.5101 0.333984 3.33329 0.333984H2.66663C2.13619 0.333984 1.62749 0.544698 1.25241 0.919771C0.87734 1.29484 0.666626 1.80355 0.666626 2.33398V5.00065C0.667483 5.75381 0.851141 6.4955 1.20183 7.16204C1.55251 7.82857 2.05974 8.40003 2.67996 8.82732C3.27585 9.35267 3.7591 9.99332 4.10055 10.7106C4.442 11.4279 4.63457 12.2069 4.66663 13.0007C4.66663 14.2383 5.15829 15.4253 6.03346 16.3005C6.90863 17.1757 8.09562 17.6673 9.33329 17.6673C10.571 17.6673 11.758 17.1757 12.6331 16.3005C13.5083 15.4253 14 14.2383 14 13.0007V12.2407C14.6284 12.0784 15.1761 11.6925 15.5404 11.1553C15.9046 10.6181 16.0605 9.96653 15.9787 9.32265C15.8969 8.67877 15.5831 8.08683 15.0961 7.65777C14.6091 7.22871 13.9823 6.992 13.3333 6.992C12.6842 6.992 12.0575 7.22871 11.5705 7.65777C11.0835 8.08683 10.7697 8.67877 10.6879 9.32265C10.6061 9.96653 10.7619 10.6181 11.1262 11.1553C11.4905 11.6925 12.0382 12.0784 12.6666 12.2407V13.0007C12.6666 13.8847 12.3154 14.7326 11.6903 15.3577C11.0652 15.9828 10.2173 16.334 9.33329 16.334C8.44924 16.334 7.60139 15.9828 6.97627 15.3577C6.35115 14.7326 5.99996 13.8847 5.99996 13.0007C6.03371 12.2059 6.22835 11.4263 6.57212 10.709C6.91589 9.99162 7.40164 9.35149 7.99996 8.82732C8.61771 8.39854 9.12235 7.82644 9.47066 7.16C9.81898 6.49356 10.0006 5.75263 9.99996 5.00065V2.33398C9.99996 1.80355 9.78925 1.29484 9.41417 0.919771C9.0391 0.544698 8.53039 0.333984 7.99996 0.333984H7.33329C7.15648 0.333984 6.98691 0.404222 6.86189 0.529246C6.73686 0.654271 6.66663 0.82384 6.66663 1.00065C6.66663 1.17746 6.73686 1.34703 6.86189 1.47206C6.98691 1.59708 7.15648 1.66732 7.33329 1.66732H7.99996C8.17677 1.66732 8.34634 1.73756 8.47136 1.86258C8.59639 1.9876 8.66663 2.15717 8.66663 2.33398V5.00065C8.66663 5.43839 8.58041 5.87184 8.41289 6.27626C8.24538 6.68068 7.99984 7.04815 7.69032 7.35767C7.38079 7.6672 7.01332 7.91273 6.6089 8.08025C6.20449 8.24777 5.77103 8.33398 5.33329 8.33398ZM13.3333 11.0007C12.9797 11.0007 12.6405 10.8602 12.3905 10.6101C12.1404 10.3601 12 10.0209 12 9.66732C12 9.3137 12.1404 8.97456 12.3905 8.72451C12.6405 8.47446 12.9797 8.33398 13.3333 8.33398C13.6869 8.33398 14.0261 8.47446 14.2761 8.72451C14.5262 8.97456 14.6666 9.3137 14.6666 9.66732C14.6666 10.0209 14.5262 10.3601 14.2761 10.6101C14.0261 10.8602 13.6869 11.0007 13.3333 11.0007Z"
            fill="#999999"
          />
        </svg>
      );

    case 'status':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.9285 7.14258C14.2127 7.14258 14.4852 7.0297 14.6861 6.82876C14.8871 6.62783 15 6.35531 15 6.07115C15 5.78699 14.8871 5.51447 14.6861 5.31353C14.4852 5.1126 14.2127 4.99972 13.9285 4.99972C13.6444 4.99972 13.3718 5.1126 13.1709 5.31353C12.97 5.51447 12.8571 5.78699 12.8571 6.07115C12.8571 6.35531 12.97 6.62783 13.1709 6.82876C13.3718 7.0297 13.6444 7.14258 13.9285 7.14258ZM10.9178 2.14258C10.3021 2.14261 9.71171 2.38722 9.27638 2.82258L2.66924 9.42972C2.23393 9.86507 1.98938 10.4555 1.98938 11.0711C1.98938 11.6868 2.23393 12.2772 2.66924 12.7126L7.28638 17.3304C7.50196 17.5461 7.75791 17.7172 8.03961 17.8339C8.32131 17.9506 8.62325 18.0107 8.92817 18.0107C9.23309 18.0107 9.53503 17.9506 9.81673 17.8339C10.0984 17.7172 10.3544 17.5461 10.57 17.3304L17.1771 10.7233C17.3928 10.5077 17.5638 10.2516 17.6805 9.96988C17.7972 9.68811 17.8572 9.38612 17.8571 9.08115V4.10686C17.8571 3.5859 17.6501 3.08628 17.2818 2.7179C16.9134 2.34953 16.4138 2.14258 15.8928 2.14258H10.9178ZM10.0342 3.58044C10.2685 3.34598 10.5864 3.21417 10.9178 3.21401H15.8928C16.3857 3.21401 16.7857 3.61401 16.7857 4.10686V9.08115C16.7857 9.41329 16.6535 9.73115 16.4192 9.96544L9.8121 16.5726C9.69602 16.6887 9.55822 16.7808 9.40655 16.8436C9.25489 16.9064 9.09233 16.9387 8.92817 16.9387C8.76401 16.9387 8.60145 16.9064 8.44979 16.8436C8.29812 16.7808 8.16032 16.6887 8.04424 16.5726L3.4271 11.9547C3.19287 11.7203 3.06129 11.4025 3.06129 11.0711C3.06129 10.7398 3.19287 10.422 3.4271 10.1876L10.0342 3.58044Z"
            fill="#999999"
          />
        </svg>
      );

    case 'avatar-default':
      return (
        <svg width="64" height="78" viewBox="0 0 64 78" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M53.2956 77.9199H10.6979C8.101 77.9199 5.61046 76.8883 3.77416 75.052C1.93787 73.2157 0.90625 70.7252 0.90625 68.1283V64.8892C0.90625 49.3439 14.8535 36.6892 31.9967 36.6892C49.14 36.6892 63.0872 49.3361 63.0872 64.8892V68.1283C63.0872 70.7252 62.0556 73.2157 60.2193 75.052C58.383 76.8883 55.8925 77.9199 53.2956 77.9199ZM31.9967 40.6137C17.0116 40.6137 4.82292 51.502 4.82292 64.897V68.1361C4.82292 69.6942 5.44189 71.1886 6.54366 72.2903C7.64544 73.3921 9.13977 74.0111 10.6979 74.0111H53.2956C54.8537 74.0111 56.3481 73.3921 57.4498 72.2903C58.5516 71.1886 59.1706 69.6942 59.1706 68.1361V64.8892C59.1706 51.502 46.9819 40.6137 31.9967 40.6137ZM31.9967 30.8181C28.9569 30.8189 25.9851 29.9181 23.4571 28.2298C20.9292 26.5415 18.9587 24.1415 17.7949 21.3333C16.631 18.525 16.3261 15.4347 16.9187 12.4531C17.5112 9.47159 18.9747 6.73273 21.1239 4.58295C23.2732 2.43316 26.0116 0.969017 28.993 0.375683C31.9744 -0.217651 35.0648 0.0864776 37.8734 1.24961C40.6819 2.41273 43.0825 4.38262 44.7714 6.91012C46.4604 9.43762 47.3618 12.4092 47.3618 15.4491C47.3587 19.5236 45.739 23.4303 42.8583 26.3118C39.9776 29.1932 36.0712 30.8139 31.9967 30.8181ZM31.9967 4.00067C29.7314 3.99989 27.5166 4.671 25.6327 5.9291C23.7488 7.1872 22.2803 8.97577 21.413 11.0686C20.5457 13.1614 20.3186 15.4644 20.7604 17.6863C21.2021 19.9082 22.2929 21.9492 23.8948 23.551C25.4967 25.1529 27.5377 26.2437 29.7596 26.6855C31.9815 27.1272 34.2845 26.9001 36.3773 26.0328C38.4701 25.1655 40.2586 23.6971 41.5167 21.8131C42.7748 19.9292 43.4459 17.7145 43.4452 15.4491C43.4421 12.4137 42.2349 9.50359 40.0886 7.35727C37.9422 5.21095 35.0321 4.00378 31.9967 4.00067Z"
            fill="#CCCCCC"
          />
        </svg>
      );

    case 'camera':
      return (
        <svg width="34" height="31" viewBox="0 0 34 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M30.125 4.51563H25.4016L23.0703 1.01617C22.9803 0.881211 22.8583 0.770598 22.7151 0.694174C22.572 0.61775 22.4122 0.577886 22.25 0.578126H11.75C11.5878 0.577886 11.428 0.61775 11.2849 0.694174C11.1417 0.770598 11.0197 0.881211 10.9297 1.01617L8.59672 4.51563H3.875C2.91773 4.51563 1.99968 4.8959 1.32279 5.57279C0.645897 6.24968 0.265625 7.16774 0.265625 8.125V26.5C0.265625 27.4573 0.645897 28.3753 1.32279 29.0522C1.99968 29.7291 2.91773 30.1094 3.875 30.1094H30.125C31.0823 30.1094 32.0003 29.7291 32.6772 29.0522C33.3541 28.3753 33.7344 27.4573 33.7344 26.5V8.125C33.7344 7.16774 33.3541 6.24968 32.6772 5.57279C32.0003 4.8959 31.0823 4.51563 30.125 4.51563ZM31.7656 26.5C31.7656 26.9351 31.5928 27.3524 31.2851 27.6601C30.9774 27.9678 30.5601 28.1406 30.125 28.1406H3.875C3.43988 28.1406 3.02258 27.9678 2.7149 27.6601C2.40723 27.3524 2.23438 26.9351 2.23438 26.5V8.125C2.23438 7.68988 2.40723 7.27258 2.7149 6.9649C3.02258 6.65723 3.43988 6.48438 3.875 6.48438H9.125C9.28724 6.48462 9.44703 6.44475 9.59014 6.36833C9.73326 6.2919 9.85527 6.18129 9.94531 6.04633L12.2766 2.54688H21.7217L24.0547 6.04633C24.1447 6.18129 24.2667 6.2919 24.4099 6.36833C24.553 6.44475 24.7128 6.48462 24.875 6.48438H30.125C30.5601 6.48438 30.9774 6.65723 31.2851 6.9649C31.5928 7.27258 31.7656 7.68988 31.7656 8.125V26.5ZM17 9.76563C15.6372 9.76563 14.3049 10.1698 13.1718 10.9269C12.0386 11.6841 11.1554 12.7602 10.6339 14.0193C10.1124 15.2784 9.9759 16.6639 10.2418 18.0005C10.5077 19.3372 11.1639 20.565 12.1276 21.5287C13.0913 22.4923 14.3191 23.1486 15.6557 23.4145C16.9924 23.6803 18.3778 23.5439 19.6369 23.0224C20.896 22.5008 21.9722 21.6176 22.7293 20.4845C23.4865 19.3513 23.8906 18.0191 23.8906 16.6563C23.8906 14.8287 23.1646 13.0761 21.8724 11.7838C20.5802 10.4916 18.8275 9.76563 17 9.76563ZM17 21.5781C16.0265 21.5781 15.075 21.2895 14.2656 20.7486C13.4562 20.2078 12.8253 19.4391 12.4528 18.5398C12.0803 17.6404 11.9828 16.6508 12.1727 15.696C12.3626 14.7413 12.8314 13.8643 13.5197 13.176C14.208 12.4876 15.085 12.0189 16.0398 11.8289C16.9945 11.639 17.9842 11.7365 18.8835 12.109C19.7829 12.4816 20.5516 13.1124 21.0924 13.9218C21.6332 14.7312 21.9219 15.6828 21.9219 16.6563C21.9219 17.9616 21.4033 19.2135 20.4803 20.1365C19.5573 21.0596 18.3054 21.5781 17 21.5781Z"
            fill="#702A14"
          />
        </svg>
      );

    default:
      return null;
  }
};

export default IconSVG;
