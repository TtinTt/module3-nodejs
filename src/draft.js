export const fetchProducts = () => {
    productApi
        .searchProducts({
            name: keyword,
            page: page,
            limit: NUMBER_RECORDS_PER_PAGE,
        })
        .then((data) => {
            setProducts(data.records);
            setTotal(data.total);
        })
        .catch((error) => {
            if (error.response.status === 401) {
                alert(error.response.statusText);
                navigate("/admin/login");
            } else {
                alert(error.response.statusText);
            }
        });

    setSelectedProductIds([]);
};
