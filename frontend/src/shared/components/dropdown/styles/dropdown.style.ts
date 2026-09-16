import { ControlProps, CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';

export const SelectCommonStyles = <Option,>(custom?: { width?: string; isInPagination?: boolean; }): StylesConfig<Option, false, GroupBase<Option>> => ({
    control: (base: CSSObjectWithLabel, state: ControlProps<Option, false>) => ({
        ...base,

        marginLeft: custom?.isInPagination ? "30px" : "0px",
        padding: "0px 15px",
        height: custom?.isInPagination ? "55px" : "60px",
        width: custom?.width || "120px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Lato",
        fontWeight: 500,
        fontSize: "16px",
        borderRadius: "14px",
        borderWidth: "2px",
        boxShadow: "none",
        outline: "none",
        color: "#1C70E9",
        borderColor: "transparent",

            "&:hover": {
                borderColor: custom?.isInPagination ? "#1C70E9" : "transparent"
            },
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
        ...base,

        color: "#BDBDBD",
        fontFamily: "Lato",
        fontWeight: 400,
        fontSize: "16px",
    }),
    menuPortal: (base: CSSObjectWithLabel) => ({
        ...base,

        zIndex: 9999,
    }),
    menu: (base: CSSObjectWithLabel) => ({
        ...base,

        width: "100%",
        borderRadius: "14px",
        overflow: "hidden",
    }),
    menuList: (base: CSSObjectWithLabel) => ({
        ...base,

        padding: "15px",
        maxHeight: "300px",
        border: "1px solid #E9EAEB",
        borderRadius: "14px",
        overflowY: "auto",
        scrollbarWidth: "none",
    }),
    option: (base: CSSObjectWithLabel, state: { isFocused: boolean; isSelected: boolean }) => ({
        ...base,

        height: "55px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "Lato",
        fontSize: "16px",
        borderRadius: "14px",
        cursor: "pointer",

        fontWeight: state.isFocused ? 900 : 500,
        color: state.isFocused ? "#FFFFFF" : "#1C70E9",
        backgroundColor: state.isFocused ? "#1C70E9" : "transparent",

            "&:active": {
                fontWeight: 700,
                color: "#FFFFFF",
                backgroundColor: "#1C70E9",
            },
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
        ...base,

        fontFamily: "Lato",
        fontWeight: 400,
        fontSize: "16px",
        color: "#212121",
    })
})
