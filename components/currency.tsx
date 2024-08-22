import useStockAlert from "@/hooks/app-states";


const MyCurrency = () => {
    const { currency } = useStockAlert();



    return currency;
};

export default MyCurrency;
