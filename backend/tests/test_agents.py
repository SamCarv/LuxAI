from app.agents.chat import build_chat_agent


def test_chat_agent_registers_tools() -> None:
    agent = build_chat_agent("test-api-key")

    toolset = agent.toolsets[0]
    tools = toolset.tools

    assert "get_current_user" in tools
    assert "update_current_user" in tools
    assert "create_category" in tools
    assert "create_transaction" in tools
    assert "list_bank_accounts" in tools
