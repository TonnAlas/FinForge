"""
FinForge Home Window

DESCRIPTION:
Standalone PySide6 home screen for the FinForge application. This window is the
new landing area for the software and exposes a left-side navigation column for
settings-oriented sections such as Financial Statements.

INPUTS:
- User interaction from the desktop UI
- Optional future settings or stored preferences

OUTPUTS:
- FinForge home window with navigation and placeholder content panels
- A dedicated Financial Statements section accessible from the left sidebar

DEPENDENCIES:
- PySide6: Desktop GUI framework

RELATED FILES:
- launch_finforge.bat: Starts this window
- FinForge_addin/FinForge_addin.py: Compatibility launcher entry point
- Guides/Developer/FinForge_Home_Window_Guide.md: Design and usage guide

NOTE:
This module is intentionally self-contained so the ribbon button can open a new
application home screen without depending on the old stock launcher window.
"""

import sys

from PySide6.QtCore import Qt
from PySide6.QtGui import QFont
from PySide6.QtWidgets import (
    QApplication,
    QButtonGroup,
    QFrame,
    QGridLayout,
    QHBoxLayout,
    QLabel,
    QMainWindow,
    QPushButton,
    QSizePolicy,
    QStackedWidget,
    QVBoxLayout,
    QWidget,
)


class NavButton(QPushButton):
    """Sidebar navigation button with a checked state."""

    def __init__(self, text: str):
        super().__init__(text)
        self.setCheckable(True)
        self.setCursor(Qt.PointingHandCursor)
        self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        self.setMinimumHeight(44)
        self.setObjectName("NavButton")


class InfoCard(QFrame):
    """Simple content card used across the home pages."""

    def __init__(self, title: str, body: str, accent: str = "#4cc9f0"):
        super().__init__()
        self.setObjectName("InfoCard")

        layout = QVBoxLayout(self)
        layout.setContentsMargins(18, 16, 18, 16)
        layout.setSpacing(8)

        title_label = QLabel(title)
        title_label.setObjectName("CardTitle")
        layout.addWidget(title_label)

        body_label = QLabel(body)
        body_label.setWordWrap(True)
        body_label.setObjectName("CardBody")
        layout.addWidget(body_label)

        self.setProperty("accent", accent)


class FinForgeHomeWindow(QMainWindow):
    """Main home screen for the FinForge application."""

    def __init__(self):
        super().__init__()
        self.setWindowTitle("FinForge Home")
        self.resize(1360, 860)
        self.setMinimumSize(1180, 760)

        self._build_ui()
        self._apply_styles()

    def _build_ui(self):
        root = QWidget()
        root.setObjectName("Root")
        self.setCentralWidget(root)

        main_layout = QHBoxLayout(root)
        main_layout.setContentsMargins(18, 18, 18, 18)
        main_layout.setSpacing(18)

        self.sidebar = QFrame()
        self.sidebar.setObjectName("Sidebar")
        self.sidebar.setFixedWidth(280)
        sidebar_layout = QVBoxLayout(self.sidebar)
        sidebar_layout.setContentsMargins(20, 22, 20, 22)
        sidebar_layout.setSpacing(14)

        brand_label = QLabel("FinForge")
        brand_font = QFont()
        brand_font.setPointSize(24)
        brand_font.setBold(True)
        brand_label.setFont(brand_font)
        brand_label.setObjectName("BrandLabel")
        sidebar_layout.addWidget(brand_label)

        brand_subtitle = QLabel(
            "Control center for workspace settings, data views, and future automation."
        )
        brand_subtitle.setWordWrap(True)
        brand_subtitle.setObjectName("SidebarSubtitle")
        sidebar_layout.addWidget(brand_subtitle)

        sidebar_layout.addSpacing(8)

        nav_title = QLabel("Navigation")
        nav_title.setObjectName("SectionLabel")
        sidebar_layout.addWidget(nav_title)

        self.nav_group = QButtonGroup(self)
        self.nav_group.setExclusive(True)
        self.nav_buttons = {}

        self.pages = QStackedWidget()
        self.pages.setObjectName("Pages")

        nav_items = [
            ("Home", self._build_home_page),
            ("Financial Statements", self._build_financial_statements_page),
            ("Advanced Settings", self._build_settings_page),
        ]

        for index, (label, page_builder) in enumerate(nav_items):
            button = NavButton(label)
            button.clicked.connect(lambda checked=False, i=index: self._set_page(i))
            self.nav_group.addButton(button)
            self.nav_buttons[index] = button
            sidebar_layout.addWidget(button)
            self.pages.addWidget(page_builder())

        sidebar_layout.addStretch(1)

        status_card = QFrame()
        status_card.setObjectName("StatusCard")
        status_layout = QVBoxLayout(status_card)
        status_layout.setContentsMargins(16, 16, 16, 16)
        status_layout.setSpacing(6)

        status_label = QLabel("Workspace status")
        status_label.setObjectName("CardTitle")
        status_layout.addWidget(status_label)

        status_body = QLabel(
            "Excel stays as an extension layer. This window is the primary home for FinForge settings."
        )
        status_body.setWordWrap(True)
        status_body.setObjectName("CardBody")
        status_layout.addWidget(status_body)

        sidebar_layout.addWidget(status_card)

        main_layout.addWidget(self.sidebar)
        main_layout.addWidget(self.pages, 1)

        self._set_page(0)

    def _build_header(self, title: str, subtitle: str) -> QWidget:
        header = QFrame()
        header.setObjectName("HeaderCard")
        layout = QVBoxLayout(header)
        layout.setContentsMargins(26, 24, 26, 24)
        layout.setSpacing(8)

        title_label = QLabel(title)
        title_font = QFont()
        title_font.setPointSize(26)
        title_font.setBold(True)
        title_label.setFont(title_font)
        title_label.setObjectName("PageTitle")
        layout.addWidget(title_label)

        subtitle_label = QLabel(subtitle)
        subtitle_label.setWordWrap(True)
        subtitle_label.setObjectName("PageSubtitle")
        layout.addWidget(subtitle_label)

        return header

    def _build_home_page(self) -> QWidget:
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(18)

        layout.addWidget(
            self._build_header(
                "FinForge Home",
                "A settings-first workspace for managing data sources, statement views, and future advanced options.",
            )
        )

        grid = QGridLayout()
        grid.setHorizontalSpacing(16)
        grid.setVerticalSpacing(16)

        cards = [
            ("Workspace Mode", "Home screen for the full FinForge experience.", "#4cc9f0"),
            ("Excel Extension", "Excel remains connected, but it is no longer the primary interface.", "#7dd3fc"),
            ("Data Center", "Use this area to surface import, sync, and validation controls later.", "#f59e0b"),
            ("Settings Roadmap", "Advanced settings can live here as the product grows.", "#34d399"),
        ]

        positions = [(0, 0), (0, 1), (1, 0), (1, 1)]
        for (title, body, accent), (row, column) in zip(cards, positions):
            grid.addWidget(InfoCard(title, body, accent), row, column)

        layout.addLayout(grid)
        layout.addStretch(1)
        return page

    def _build_financial_statements_page(self) -> QWidget:
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(18)

        layout.addWidget(
            self._build_header(
                "Financial Statements",
                "Use this section as the home for balance sheet, income statement, and cash flow related controls.",
            )
        )

        grid = QGridLayout()
        grid.setHorizontalSpacing(16)
        grid.setVerticalSpacing(16)

        cards = [
            ("Balance Sheet", "Show asset, liability, and equity controls here.", "#4cc9f0"),
            ("Income Statement", "Display revenue, expense, and profit settings here.", "#7dd3fc"),
            ("Cash Flow", "Reserve this area for operating, investing, and financing views.", "#f59e0b"),
            ("Quarterly vs Annual", "Add statement period toggles and presets here later.", "#34d399"),
        ]

        positions = [(0, 0), (0, 1), (1, 0), (1, 1)]
        for (title, body, accent), (row, column) in zip(cards, positions):
            grid.addWidget(InfoCard(title, body, accent), row, column)

        layout.addLayout(grid)
        layout.addWidget(
            InfoCard(
                "Next Step",
                "This page can evolve into the statement workspace where users choose statement types, columns, and formatting rules.",
                "#a78bfa",
            )
        )
        layout.addStretch(1)
        return page

    def _build_settings_page(self) -> QWidget:
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(18)

        layout.addWidget(
            self._build_header(
                "Advanced Settings",
                "Reserved for appearance, automation, data refresh, and workbook behavior controls.",
            )
        )

        layout.addWidget(
            InfoCard(
                "Theme and Layout",
                "Store window sizing, color palette, and default landing-page preferences here.",
                "#4cc9f0",
            )
        )
        layout.addWidget(
            InfoCard(
                "Data and Sync",
                "Add refresh schedules, cache behavior, and source validation settings here.",
                "#f59e0b",
            )
        )
        layout.addWidget(
            InfoCard(
                "Excel Integration",
                "Keep workbook-specific behavior here so Excel stays an extension of the core app.",
                "#34d399",
            )
        )
        layout.addStretch(1)
        return page

    def _set_page(self, index: int):
        self.pages.setCurrentIndex(index)
        for button_index, button in self.nav_buttons.items():
            button.setChecked(button_index == index)

    def _apply_styles(self):
        self.setStyleSheet(
            """
            QMainWindow {
                background: #07111d;
            }
            QWidget#Root {
                color: #e5eef8;
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 1,
                    stop: 0 #08111d, stop: 0.45 #0b1727, stop: 1 #101d31);
            }
            QFrame#Sidebar {
                background: #08111d;
                border: 1px solid #1d3248;
                border-radius: 22px;
            }
            QLabel#BrandLabel {
                color: #f3f8ff;
            }
            QLabel#SidebarSubtitle,
            QLabel#CardBody,
            QLabel#PageSubtitle {
                color: #9fb3c8;
                font-size: 12px;
                line-height: 1.35;
            }
            QLabel#SectionLabel {
                color: #7ea2c0;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            QPushButton#NavButton {
                text-align: left;
                padding: 12px 14px;
                border-radius: 14px;
                border: 1px solid transparent;
                color: #c9d8e6;
                background: transparent;
                font-size: 13px;
                font-weight: 600;
            }
            QPushButton#NavButton:hover {
                background: rgba(76, 201, 240, 0.12);
                border-color: rgba(76, 201, 240, 0.18);
            }
            QPushButton#NavButton:checked {
                background: rgba(76, 201, 240, 0.18);
                border-color: rgba(76, 201, 240, 0.42);
                color: #f7fbff;
            }
            QFrame#StatusCard,
            QFrame#HeaderCard,
            QFrame#InfoCard {
                background: rgba(9, 18, 30, 0.88);
                border: 1px solid #21364b;
                border-radius: 20px;
            }
            QLabel#CardTitle,
            QLabel#PageTitle {
                color: #f7fbff;
                font-weight: 700;
            }
            QStackedWidget#Pages {
                background: transparent;
            }
            """
        )


def main():
    """Start the FinForge home window."""
    app = QApplication.instance()
    created_app = False
    if app is None:
        app = QApplication(sys.argv)
        created_app = True

    window = FinForgeHomeWindow()
    window.show()

    if created_app:
        sys.exit(app.exec())

    return window


def launch_home_window():
    """Compatibility wrapper for external launchers."""
    return main()


if __name__ == "__main__":
    main()