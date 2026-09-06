from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.routine.routine_service import RoutineService


class RoutineGetTool(CodedTool):
    """
    Retrieve the user's stored daily routine.
    """

    async def async_invoke(
        self,
        args: dict,
        sly_data: dict,
    ) -> dict:

        user_id = 1

        service = RoutineService()

        routine = service.get_routine(
            user_id=user_id,
        )

        return {
            "success": True,
            "user_id": user_id,
            "routine": routine,
        }