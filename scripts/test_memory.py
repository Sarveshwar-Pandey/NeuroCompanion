from backend.services.memory.memory_service import MemoryService


def main() -> None:
    service = MemoryService()

    queries = [
        "Harpreet Sahu",
        "Harpreet",
        "daughter",
        "wife",
        "Manpreet",
        "Aarav",
        "unknown person",
    ]

    for query in queries:
        result = service.get_person(
            user_id=1,
            name_or_alias=query,
        )

        print(f"\nQuery: {query}")
        print(f"Result: {result}")


if __name__ == "__main__":
    main()