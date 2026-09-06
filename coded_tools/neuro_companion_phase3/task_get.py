from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.routine.routine_service import RoutineService


class TaskGetTool(CodedTool):
    """
    Retrieve pending tasks for the user.
    """

    async def async_invoke(
        self,
        args: dict,
        sly_data: dict,
    ) -> dict:

        user_id = 1

        service = RoutineService()

        tasks = service.get_tasks(
            user_id=user_id,
        )

        return {
            "success": True,
            "user_id": user_id,
            "tasks": tasks,
        }