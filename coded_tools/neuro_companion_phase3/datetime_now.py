from datetime import datetime
from zoneinfo import ZoneInfo

from neuro_san.interfaces.coded_tool import CodedTool


class DateTimeNowTool(CodedTool):
    """
    Return the current date and time.
    """

    async def async_invoke(
        self,
        args: dict,
        sly_data: dict,
    ) -> dict:

        timezone_name = args.get(
            "timezone",
            "Asia/Kolkata",
        )

        try:
            timezone = ZoneInfo(timezone_name)
        except Exception:
            return {
                "success": False,
                "error": f"Unknown timezone: {timezone_name}",
            }

        now = datetime.now(timezone)

        return {
            "success": True,
            "timezone": timezone_name,
            "date": now.date().isoformat(),
            "time": now.strftime("%H:%M"),
            "datetime": now.isoformat(),
            "day_of_week": now.strftime("%A"),
        }