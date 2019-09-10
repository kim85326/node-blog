const convertPagination = (items, currentPage) => {
    const totalCount = items.length;
    const perPages = 3;
    const totalPages = Math.ceil(totalCount / perPages);
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startItemIndex = (currentPage - 1) * 3;
    const endItemIndex = currentPage * 3 - 1;

    const filterItems = items.filter(function(item, i) {
        return i >= startItemIndex && i <= endItemIndex;
    });

    const pagination = {
        totalPages,
        currentPage,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
    };

    return {
        filterItems,
        pagination,
    };
};

module.exports = convertPagination;
