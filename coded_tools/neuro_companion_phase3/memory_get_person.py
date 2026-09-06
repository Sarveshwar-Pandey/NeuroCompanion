from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.memory.memory_service import MemoryService


class MemoryGetPersonTool(CodedTool):
    """
    Retrieve a person and their relationship from the user's memory database.
    """

    async def async_invoke(
        self,
        args: dict,
        sly_data: dict,
    ) -> dict:

        name_or_alias = args.get("name_or_alias")

        if not name_or_alias:
            return {
                "success": False,
                "error": "name_or_alias is required",
            }

        # Temporary development identity.
        # Authentication/Sly Data will replace this later.
        user_id = 1

        service = MemoryService()

        result = service.get_person(
            user_id=user_id,
            name_or_alias=name_or_alias,
        )

        if result is None:
            return {
                "success": True,
                "found": False,
                "query": name_or_alias,
                "message": "No reliable matching person was found.",
            }

        return {
            "success": True,
            "found": True,
            "person": result,
        }