# BaseballVisualization
3 charts by d3


根据棒球运动的背景，运动员的身份分为打手、投手和捕手三种，调研到衡量运动员的实力主要因素是运动员的进攻数据、投球数据和防备数据。所有的数据运算整合等预处理都是通过python完成。
1. 进攻数据，用来衡量一名运动员的打击和跑垒的表现，可以选用选手的打击率 AVG = H / AB来代表“进攻数据”；
2. 投球数据，用来衡量一名运动员的投球的表现，可以选用选手的防御率 EAR = ER / IP * 9 = ER / IPOuts * 27来代表“投球数据”；
3. 防备数据，用来衡量一名选手的防守的表现，可以选用选手的守备率 FPCT = (PO+A) / (PO+A+E)来代表“防备数据”。
因此选取运动员这15年的所有的数据综合计算其三个数据，可以得出选手的综合实力。
4. 所有运动员15年所有的薪资总体情况，并进行汇总得出其这15年的平均薪资。