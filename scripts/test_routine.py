from backend.services.routine.routine_service import RoutineService


def main():

    service = RoutineService()

    print("\n=== ROUTINE ===")

    routine = service.get_routine(user_id=1)

    for item in routine:
        print(
            f"{item['time']} - "
            f"{item['title']}"
        )

    print("\n=== TASKS ===")

    tasks = service.get_tasks(user_id=1)

    for task in tasks:
        print(task)


if __name__ == "__main__":
    main()