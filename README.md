    # Polis

Polis는 AI 기반 의견 수집 플랫폼입니다. 설문조사보다 유기적이고, 포커스 그룹보다 적은 노력으로 운영할 수 있습니다.

자세한 방법론 논문은 [Polis: Scaling Deliberation by Mapping High Dimensional Opinion Spaces][methods-paper]를 참조하세요.

   [methods-paper]: https://www.e-revistes.uji.es/index.php/recerca/article/view/5516/6558

<!-- Changes to badge text in URLs below, require changes to "name" value in .github/workflows/*.yml -->
[![DPG Badge](https://img.shields.io/badge/Verified-DPG-3333AB?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMzEiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMSAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0LjIwMDggMjEuMzY3OEwxMC4xNzM2IDE4LjAxMjRMMTEuNTIxOSAxNi40MDAzTDEzLjk5MjggMTguNDU5TDE5LjYyNjkgMTIuMjExMUwyMS4xOTA5IDEzLjYxNkwxNC4yMDA4IDIxLjM2NzhaTTI0LjYyNDEgOS4zNTEyN0wyNC44MDcxIDMuMDcyOTdMMTguODgxIDUuMTg2NjJMMTUuMzMxNCAtMi4zMzA4MmUtMDVMMTEuNzgyMSA1LjE4NjYyTDUuODU2MDEgMy4wNzI5N0w2LjAzOTA2IDkuMzUxMjdMMCAxMS4xMTc3TDMuODQ1MjEgMTYuMDg5NUwwIDIxLjA2MTJMNi4wMzkwNiAyMi44Mjc3TDUuODU2MDEgMjkuMTA2TDExLjc4MjEgMjYuOTkyM0wxNS4zMzE0IDMyLjE3OUwxOC44ODEgMjYuOTkyM0wyNC44MDcxIDI5LjEwNkwyNC42MjQxIDIyLjgyNzdMMzAuNjYzMSAyMS4wNjEyTDI2LjgxNzYgMTYuMDg5NUwzMC42NjMxIDExLjExNzdMMjQuNjI0MSA5LjM1MTI3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==)](https://digitalpublicgoods.net/r/polis)
[![Docker Image Builds](https://github.com/compdemocracy/polis/workflows/Docker%20image%20builds/badge.svg)][docker-image-builds]
[![E2E Tests](https://github.com/compdemocracy/polis/workflows/E2E%20Tests/badge.svg)][e2e-tests]

   [docker-image-builds]: https://hub.docker.com/u/compdem
   [e2e-tests]: https://github.com/compdemocracy/polis/actions?query=workflow%3A%22E2E+Tests%22

---

## 여기서 시작하세요!

Polis 사용 또는 기여에 관심이 있으시다면 아래를 참조하세요:

- [**지식 베이스**][knowledge-base]: 시스템을 이해하고 사용하는 데 도움이 되는 종합 위키
- [**메인 배포**](https://pol.is): Polis의 메인 배포는 <https://pol.is>이며, 비영리 및 정부 기관은 무료로 사용 가능합니다
- [**토론**][discussions]: 질의응답(QA) 및 토론
- [**이슈**][issues]: 명확하게 정의된 기술적 이슈
- [**프로젝트 보드**][board]: 다소 불완전하지만 여전히 유용합니다
- [**문의**][hello]: 높은 영향력이 있는 맥락에서 Polis를 적용 중이며, 위 공개 채널로는 충분한 도움을 받기 어려운 경우

   [knowledge-base]: https://compdemocracy.org/Welcome
   [issues]: https://github.com/compdemocracy/polis/issues
   [board]: https://github.com/compdemocracy/polis/projects/1
   [beta-board]: https://github.com/compdemocracy/polis/projects/1
   [discussions]: https://github.com/compdemocracy/polis/discussions
   [hello]: mailto:hello@compdemocracy.org

Polis 배포 또는 개발 환경을 설정하려면 이 문서의 나머지 부분을 읽어주세요.

---

## Polis 실행하기

Polis는 [프로덕션 배포](#프로덕션-배포) 또는 [개발 환경](#개발-도구)을 위한 완전한 시스템을 Docker 인프라로 제공합니다.
따라서 Polis를 실행하기 위한 유일한 전제 조건은 최신 `docker`(Mac 또는 Windows의 경우 Docker Desktop)를 설치하는 것입니다.

Docker를 사용할 수 없는 경우, 이 저장소의 하위 디렉토리(`math`, `server`, `delphi`, `*-client`)에 있는 Dockerfile을 수동 설정의 참고 자료로 활용할 수 있습니다.

### 빠른 시작

#### 1. SSL 인증서 설치 및 설정

Polis는 OIDC 인증 시뮬레이터를 위해 로컬 신뢰 SSL 인증서를 사용합니다. 이 설정은 한 번만 하면 됩니다:

```sh
# mkcert 설치 (macOS + Homebrew)
brew install mkcert
brew install nss  # Firefox를 사용하는 경우

# 기타 플랫폼: https://github.com/FiloSottile/mkcert#installation
```

```sh
# 로컬 인증 기관(CA) 설치
mkcert -install

# localhost용 인증서 생성
mkdir -p ~/.simulacrum/certs
cd ~/.simulacrum/certs
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1 oidc-simulator host.docker.internal

# 루트 CA 인증서 복사 (서버 간 통신에 필요)
cp "$(mkcert -CAROOT)/rootCA.pem" ~/.simulacrum/certs/
```

**중요**: `mkcert -install` 실행 후, 인증서를 신뢰하려면 브라우저를 완전히 재시작하세요.

#### 2. JWT 키 생성

Polis는 참여자 인증을 위해 JWT 키를 사용합니다. 다음 명령으로 생성하세요:

```sh
make generate-jwt-keys
```

이 명령은 `server/keys/jwt-private.pem`과 `server/keys/jwt-public.pem`을 생성합니다.

#### 3. Polis 시작

```sh
cp example.env .env
make start
```

위 명령은 개발 오버레이(아래 참조)와 기본 설정값으로 docker compose를 실행합니다.

Mac에서 AirPlay 수신기가 활성화되어 있으면 포트 5000 충돌로 오류가 발생할 수 있습니다. `.env` 파일에서 포트를 변경하거나 시스템 설정에서 AirPlay 수신기를 비활성화하세요.

`localhost:80/createuser`에 접속하여 시작하세요.

### Docker & Docker Compose

최신 버전의 `docker`에는 `docker compose`가 하위 명령으로 내장되어 있습니다.
이전 버전을 사용하는 경우 `docker-compose`를 별도로 설치해야 합니다.
단, Docker Swarm을 활용한 [스케일링](/docs/scaling#docker-compose-over-docker-swarm) 옵션을 사용하려면 최신 `docker compose` 명령이 필요합니다.

Makefile에 편리한 명령어들이 있습니다. 사용 가능한 명령 목록은 `make help`로 확인하세요.

### 컨테이너 빌드 및 실행

먼저 저장소를 클론한 후, 명령줄에서 루트 디렉토리로 이동하여 다음 명령을 실행해 Docker 컨테이너를 빌드하고 실행합니다.

example.env 파일을 복사하고 필요에 따라 수정하세요 (개발 및 테스트 목적이라면 그대로 사용해도 됩니다).

```sh
cp example.env .env
```

```sh
docker compose --profile postgres --profile local-services up --build
```

권한 오류가 발생하면 `sudo`를 붙여 실행해보세요.
향후 `sudo` 없이 사용하려면 (Linux 또는 WSL) [여기의 설정 안내](https://docs.docker.com/engine/install/linux-postinstall/)를 따르세요.

Docker 이미지를 빌드한 후에는 `--build` 없이 실행할 수 있으며, 더 빠를 수 있습니다:

```sh
docker compose --profile postgres --profile local-services up
```

또는 간단히

```sh
make start
```

이미지를 _다시 빌드_하려면 `--build`를 다시 붙이면 됩니다. `make start-rebuild`로도 쉽게 빌드 및 시작할 수 있습니다.

.env의 설정값만 변경한 경우, `--force-recreate`로 완전한 재빌드 없이 컨테이너를 재생성할 수 있습니다:

```sh
docker compose --profile postgres --profile local-services down
docker compose --profile postgres --profile local-services up --force-recreate
```

컨테이너 환경이 어떻게 구성되는지 확인하려면:

```sh
docker compose --profile postgres --profile local-services convert
```

#### 로컬 또는 원격(비 Docker) 데이터베이스 사용

로컬 또는 원격 데이터베이스를 사용하려면 `--profile postgres` 플래그를 생략하세요. `.env` 파일에서 `DATABASE_URL` 환경 변수를 데이터베이스에 맞게 설정해야 합니다.

`make` 명령 사용 시, `POSTGRES_DOCKER`를 `true` 또는 `false`로 설정하면 `docker compose` 호출 시 `--profile postgres`의 자동 포함 여부가 결정됩니다.

#### 프로덕션 모드 단축키

Makefile의 명령에 PROD를 접두사로 붙이면 `docker-compose.dev.yml`의 "개발 오버레이" 설정이 무시됩니다.
HTTP 프록시(80/443) 외의 서비스 포트는 노출되지 않으며, 컨테이너는 로컬 디렉토리를 마운트하거나 변경을 감시하거나 자동으로 재빌드하지 않습니다.

`prod.env` 파일이 필요합니다:

`cp example.env prod.env` (그리고 적절히 수정하세요).

그런 다음 다음과 같이 실행할 수 있습니다:

```sh
make PROD start

make PROD start-rebuild
```

### 로컬 클라우드 서비스 에뮬레이터 없이 실행

로컬 MinIO 및 DynamoDB 서비스 없이 스택을 실행하려면 (예: .env 파일에 설정된 실제 AWS 서비스에 연결하려는 경우) `--profile local-services` 플래그를 생략하세요.

예시: 컨테이너화된 DB를 사용하되 외부/실제 클라우드 서비스에 연결:

```sh
docker compose --profile postgres up
```

예시: 외부 DB와 외부/실제 클라우드 서비스 사용 (프로덕션에 가장 가까운 구성):

```sh
docker compose up
```

### 인스턴스 테스트

이제 `http://localhost:80/home`에 접속하여 설정을 테스트할 수 있습니다.

#### 사전 정의된 테스트 계정 사용

`make start` 또는 개발 설정으로 실행하면 사전 정의된 테스트 사용자가 있는 OIDC 시뮬레이터가 자동으로 시작됩니다. 다음 계정으로 즉시 로그인할 수 있습니다:

- **이메일**: `admin@polis.test`
- **비밀번호**: `Te$tP@ssw0rd*`

추가 테스트 사용자:

- `moderator@polis.test` / `Te$tP@ssw0rd*`
- `test.user.0@polis.test` ~ `test.user.49@polis.test` (모두 비밀번호 `Te$tP@ssw0rd*`)

OIDC 시뮬레이터의 제한으로 인해, 개발 및 테스트 환경에서는 새로운 관리자 사용자를 등록할 수 없습니다.

#### 종료

작업이 끝나면 `Ctrl+C`로 프로세스를 종료하거나, "분리 모드"로 실행 중인 경우 `docker compose --profile postgres --profile local-services down`을 입력하세요.

### 시스템 업데이트

시스템을 업데이트하려면 다음을 처리해야 할 수 있습니다:

- 새로운 [데이터베이스 마이그레이션 실행](docs/migrations.md)
- Dockerfile에 변경이 있는 경우 `--build`로 Docker 이미지 업데이트
  - 처음부터 완전히 재빌드하려면 `--no-cache` 사용을 고려하세요 (시간이 더 오래 걸립니다)

---

## 프로덕션 배포

위의 명령으로 Polis 시스템을 실행할 수 있지만, 시스템을 적절히 구성, 보안 및 확장하려면 추가 단계가 필요합니다.
특히:

- [시스템 구성](docs/configuration.md), 특히:
  - 서비스를 제공할 도메인 이름
  - 서드파티 서비스를 위한 API 키 활성화 및 추가 (자동 댓글 번역, 스팸 필터링 등)
- [SSL/HTTPS 설정](docs/ssl.md), 사이트 보안을 위해
- [스케일링](docs/scaling.md), 대규모 또는 다수의 동시 대화를 위해

### 지원

배포 설정에 대한 지원은 위의 공개 채널을 활용하시기 바랍니다.
다만, 높은 영향력이 있는 맥락에서 배포 중이며 도움이 필요하시면 [문의해 주세요][hello]

---

## 개발 도구

[위에서 설명한 대로 Polis를 실행](#polis-실행하기)한 후, 다음 명령으로 개발자 편의 기능을 활성화할 수 있습니다:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile postgres up
```

(처음 실행하거나 컨테이너를 재빌드해야 하는 경우 `--build`와 함께 실행하세요)

이 명령은 다음을 활성화합니다:

- 서버 코드의 실시간 코드 리로딩 및 정적 타입 검사
- 실행 중인 math 프로세스에 연결하기 위한 nREPL 연결 포트 개방
- 데이터베이스 컨테이너에 직접 연결하기 위한 포트 개방
- 클라이언트 저장소의 실시간 코드 리로딩 (진행 중)
- 등등

이 명령은 `docker-compose.dev.yml` _오버레이_ 파일을 활용하며, `docker-compose.yml` 파일에 설명된 기본 시스템 위에 개발자 편의 기능을 추가합니다.
이러한 기능이 필요한 모든 `docker` 명령에 `-f docker-compose.yml -f docker-compose.dev.yml` 인수를 지정할 수 있습니다.

`docker-compose.x.yml` 파일을 직접 만들어 오버레이로 사용하고, `docker-compose.yml`의 기본값과 다른 값을 추가하거나 수정할 수 있습니다.

### 테스트

GitHub PR에 대한 자동화된 엔드투엔드 브라우저 테스트에 Cypress를 사용합니다 (위 배지 참조).
이 테스트를 로컬에서 실행하는 방법은 [`e2e/README.md`](/e2e/README.md)를 참조하세요.

### 기타 사항 및 문제 해결

#### Docker 문제

많은 문제는 모든 Docker 컨테이너를 종료하거나 Docker 자체를 재시작하면 해결될 수 있습니다. 그래도 해결되지 않으면 다음 명령으로 모든 Polis 컨테이너와 볼륨을 삭제하고 (**데이터베이스 볼륨 포함이므로 프로덕션에서는 사용하지 마세요!**) 완전히 재빌드할 수 있습니다:

`make start-FULL-REBUILD`

추가 유용한 명령은 `make help`를 참조하세요.

#### Git 설정

과거 파일 재구성으로 인해, 다음 Git 설정이 히스토리 조회에 도움이 될 수 있습니다:

```sh
git config --local include.path ../.gitconfig
```

#### 백그라운드 프로세스로 실행

docker compose를 백그라운드 프로세스로 실행하려면 `up` 명령에 `--detach` 플래그를 추가하고, `docker compose --profile postgres --profile local-services down`으로 중지하세요.

#### Docker Machine을 개발 환경으로 사용

개발 머신이 모든 Docker 컨테이너를 처리하는 데 어려움이 있다면 [Docker Machine 사용 안내](/docs/docker-machine.md)를 참조하세요.

#### npm이 라이브러리를 찾지 못하는 문제 해결

npm/docker가 이상한 상태에 빠지는 경우가 있으며, 특히 네이티브 라이브러리에서 발생합니다.
`Error: Cannot find module .... bcrypt`와 같은 메시지가 나타날 수 있습니다.

이 경우 [여기의 안내를 따르세요.](https://github.com/compdemocracy/polis/issues/1391)

#### Apple Silicon (M1 & M2) 칩 관련 문제

일부 의존성, 특히 nodejs 및 postgres 관련 패키지를 [Rosetta 터미널](https://support.apple.com/en-us/HT211861)에서 설치해야 할 수 있습니다. Apple 컴퓨터에서 이상한 빌드 문제가 발생하면 이슈를 생성하거나 문의하세요.

## 라이선스

[AGPLv3 (섹션 7에 따른 추가 권한 포함)](/LICENSE)
