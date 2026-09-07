from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from neuro_san.client.agent_session_factory import AgentSessionFactory

from backend.config import NEURO_SAN_AGENT


# Load the project environment before Neuro-SAN initializes.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")


class NeuroSanClient:
    """
    Thin wrapper around the Neuro-SAN Python client.

    Keeps Neuro-SAN-specific details out of FastAPI routes.
    """

    def __init__(self, agent_name: str = NEURO_SAN_AGENT) -> None:
        self.agent_name = agent_name
        self._factory = AgentSessionFactory()

    def _create_session(self):
        return self._factory.create_session(
            "direct",
            self.agent_name,
            use_direct=True,
        )

    async def chat(
        self,
        message: str,
        sly_data: dict[str, Any] | None = None,
    ) -> str:
        """
        Send one message through the Neuro-SAN network.

        The installed DirectAgentSession expects a request dictionary.
        """
        session = self._create_session()

        request_dict = {
            "user_message": {
                "text": message,
            },
            "sly_data": sly_data or {},
        }

        response_texts: list[str] = []

        for response in session.streaming_chat(request_dict):
            response_payload = response.get("response", {})

            if not isinstance(response_payload, dict):
                continue

            text = response_payload.get("text")

            if text:
                response_texts.append(str(text))

        return "\n".join(response_texts).strip()