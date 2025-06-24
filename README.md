# 🎵 Statify 📊

---
## 1. 프로젝트 소개
- Statify는 [스포티파이 차트](https://charts.spotify.com/charts/overview/global) 데이터를 이용한 다양한 데이터 시각화 웹사이트입니다.
- 다양한 나라의 장르, 인기 아티스트, 차트 등을 볼 수 있습니다.

---
## 2. 기술스택
각종 차트 : recharts, react-force-graph-2d

지구본 <img src="https://img.shields.io/badge/D3js-F9A03C?style=for-the-badge&logo=D3js&logoColor=white">

api <img src="https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=Spotify&logoColor=white">

<img src="https://img.shields.io/badge/Javascript-F7DF1E.svg?style=for-the-badge&logo=Javascript&logoColor=white"><img src="https://img.shields.io/badge/Nodejs-5FA04E?style=for-the-badge&logo=Nodejs&logoColor=white"><img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?&style=for-the-badge&logo=React&logoColor=black"/>

---
## 3. 화면구성
### 웰컴페이지
- 웰컴페이지에서 각 페이지로 이동할 수 있는 네비게이션 바와 아티스트 검색창이 있다.
- 검색창에서 아티스트를 검색하면 Artist 페이지로 넘어가게 된다.

https://github.com/user-attachments/assets/615f5af9-9ae8-435e-963e-f2a23aca2f20


### 장르페이지
- 페이지 로드 시에 왼쪽 부분에 디폴트로 global 장르 top7을 보여주고 각 나라를 선택할 수 있는 지구본을 보여준다.
- 지구본에서 나라 선택시에 오른쪽 부분에 해당 국가 장르 top7을 보여주고 글로벌과 선택 국가 장르 차트를 클릭하면 해당 장르에 관한 아티스트 top5를 보여준다.


https://github.com/user-attachments/assets/896ecec9-46a2-4882-9256-ee8b589e4471

### 아티스트 검색 페이지
- 아티스트 검색 시 해당 아티스트와 관련된 아티스트들과의 인기도 차트를 보여준다.
- 검색 아티스트의 인기곡 top5를 보여준다.
- 검색 아티스트와 협업(피쳐링 등)한 아티스트들과의 네트워크 그래프를 보여준다. 


https://github.com/user-attachments/assets/30870f3c-db8a-4599-856f-9ba8ac4b219b


### 히스토리 페이지
- 날짜를 선택할 수 있는 캘린더를 보여준다.
- 페이지 로드시에 디폴트로 글로벌 차트를 보여주고 나라 선택시에 해당 나라, 해당 날짜의 top200 차트를 보여준다

https://github.com/user-attachments/assets/f799ed5e-d0cb-45f2-9e1c-21bf055fd2da


### 스트리밍 페이지
- 페이지 로드 시에 디폴트로 글로벌로 아티스트당 2025년의 총 스트리밍 순으로 아티스트를 보여주고 나라 선택 시에 해당 나라에서의 스트리밍 순으로 아티스트를 보여준다 
- 아티스트 차트에서 아티스트 클릭하면 해당 아티스트의 곡들이 차트로 보여지게 된다.
- 곡 선택 시 해당 곡의 스트리밍 등락률을 시간에 따라 그래프로 보여준다.

https://github.com/user-attachments/assets/f2107271-bf72-49f4-b05b-8cd3f5ce70ec


## 4. 개선사항
- 현재는 스포티파이 차트에서 사용하는 비공식 api를 사용해 데이터를 긁어오는 방식이다. 내부에서 사용하는 토큰을 코드에 직접 입력해줘야하고 api를 사용하기 때문에 페이지 로딩 시간도 너무 길다.
- 데이터를 따로 DB에 저장해 불러와야 할 것 같다.




