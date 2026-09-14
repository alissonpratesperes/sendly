import { ControlProps, CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';

export const SelectCommonStyles = <Option,>(custom?: { width?: string }): StylesConfig<Option, false, GroupBase<Option>> => ({
    control: (base: CSSObjectWithLabel, state: ControlProps<Option, false>) => ({
        ...base,

        marginLeft: "30px",
        padding: "0px 15px",
        height: "55px",
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
        color: "#171719",
        borderColor: "#E9EAEB",

            "&:hover": {
                borderColor: "#171719"
            },

        backgroundColor: state.isDisabled ? "#171719" : "transparent",
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

        padding: "7.5px",
        maxHeight: "auto",
        border: "1px solid #E9EAEB",
        borderRadius: "14px",
        overflowY: "auto",
        scrollbarWidth: "none",

            "&::-webkit-scrollbar": {
                display: "none"
            },
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
        color: state.isFocused ? "#FFFFFF" : "#171719",
        backgroundColor: state.isFocused ? "#171719" : "transparent",

            "&:active": {
                fontWeight: 700,
                color: "#FFFFFF",
                backgroundColor: "#171719",
            },
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
        ...base,

        fontFamily: "Lato",
        fontWeight: 700,
        fontSize: "16px",
        color: "#171719",
    })
})
