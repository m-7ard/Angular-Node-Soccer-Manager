class FilterAllPlayersCriteria {
    private readonly __type: "FILTER_PLAYERS_CRITERIA" = null!;

    constructor(props: { name: string | null; limitBy: number | null }) {
        this.name = props.name;
        this.limitBy = props.limitBy;
    }

    public name: string | null;
    public limitBy: number | null;

    public equal(other: FilterAllPlayersCriteria) {
        return this.name === other.name && this.limitBy === other.limitBy;
    }
}

export default FilterAllPlayersCriteria;
