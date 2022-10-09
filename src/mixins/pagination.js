export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    paginationData() {
      return this.parseDataPagination(
        this.filteredData,
        this.currentPage,
        this.pageSize
      );
    },
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    parseDataPagination(data, page = 1, limit = 10) {
      if (!data.length) return [];
      const offset = (page - 1) * limit;
      return data.slice(offset).slice(0, limit);
    },
  },
};
