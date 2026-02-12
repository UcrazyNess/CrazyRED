# 🚩 CrazyRED

### Red Team Infrastructure Management & SIEM
**Centralized Command. Unified Operations. Total Visibility.**

![License](https://img.shields.io/badge/license-GPLv3-blue.svg)
![Status](https://img.shields.io/badge/status-Active%20Development-green.svg)

---

## 💀 The Problem
Blue Teams have sophisticated **SIEMs** (Splunk, ELK, Sentinel) to visualize threats, manage logs, and coordinate defense.
**Red Teams**, however, often operate in chaos: scattered terminal windows, loose text files for logs, and disconnected tools.

## 🩸 The Solution: CrazyRED
**CrazyRED** is the "SIEM for Red Teams." It is a modular ecosystem that unifies your offensive infrastructure. It bridges the gap between the operator in the terminal and the team leader needing a strategic overview.

---

## 🏗️ Architecture & Ecosystem

CrazyRED operates as a three-part synchronized system:



### 1. 🧠 [crazyAPI](https://github.com/UcrazyNess/crazyAPI) (The Brain)
The central nervous system. A powerful backend that orchestrates data flow between operators and the dashboard.
* **Tech Stack:** **PHP / Laravel**.
* **Role:**
    * Centralized database for targets, loot, and logs.
    * Secure authentication (Sanctum/Passport) for operators.
    * Real-time event broadcasting to the WebAPP.
    * RESTful endpoints for the Shell CLI.

### 2. 👁️ [crazyWEBAPP](https://github.com/UcrazyNess/crazyWEBAPP) (The Dashboard)
The Tactical Operation Center (TOC). A visual interface for situational awareness.
* **Tech Stack:** **React / TypeScript (Vite)**.
* **Role:**
    * Live map of compromised hosts.
    * Visual timeline of the attack chain.
    * Team collaboration and status tracking.
    * One-click reporting.

### 3. ⌨️ [crazySHELL](https://github.com/UcrazyNess/crazySHELL) (The Interface)
The operator's blade. A specialized CLI tool for high-speed engagement.
* **Tech Stack:** Custom CLI Implementation.
* **Role:**
    * Executes commands directly against the infrastructure.
    * Fetches target data without leaving the terminal.
    * Pushes local logs to the central API automatically.

---

## 🚀 Key Features

* **Persistence & History:** Never lose a command output. All shell sessions are logged to the API.
* **Real-Time Sync:** When an operator pwns a machine via `crazySHELL`, the status updates instantly on the `crazyWEBAPP` dashboard for the whole team to see.
* **Role-Based Access:** Granular control over who can see or execute what within the operation.
* **Automated Looting:** Structured storage for harvested credentials and files.
