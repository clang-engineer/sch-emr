SELECT
    MAX(decode(a, 'E', 'Y', 'N')) e
    ,
    MAX(decode(b, 'F', 'Y', 'N')) f

    ,
    MAX(decode(c, 'G', 'Y', 'N')) g

    ,
    MAX(decode(d, 'H', 'Y', 'N')) h
FROM
    (
        SELECT
            'E' AS a
            ,
            '' AS b
            ,
            '' AS c
            ,
            '' AS d
            ,
            acpt.pid AS pid
        FROM
            ast.aeahacpt acpt
            ,
            ast.aebmeccd eccd
            ,
            ast.aerhrslt rslt
        WHERE
            acpt.execprcpstatcd IN ('730', '740')
          AND acpt.instcd = '052'
          AND acpt.prcpdd >= TO_CHAR(ADD_MONTHS(to_date(:inDate, 'YYYYMMDD'),-12), 'YYYYMMDD')
          AND acpt.actorddd = :inDate
          AND acpt.prcpdd >= TO_CHAR(ADD_MONTHS(to_date(:inDate, 'YYYYMMDD'),-12), 'YYYYMMDD')
          AND acpt.actorddd BETWEEN :inDate AND :outDate
          AND acpt.pid = :ptNo
          AND acpt.cretno = '2'
          AND eccd.instcd = acpt.instcd
          AND eccd.excucd = acpt.prcpcd
          AND eccd.suppdeptcd = acpt.suppdeptcd
          AND acpt.prcpdd BETWEEN eccd.excufromdd AND eccd.excutodd
          AND eccd.rsltdispgbn = 'E'
          AND acpt.rsltdd = rslt.rsltdd
          AND acpt.rsltno = rslt.rsltno
          AND acpt.suppdeptcd = rslt.suppdeptcd
          AND acpt.instcd = rslt.instcd
          AND rownum = 1
        UNION ALL
        SELECT
            ''
            ,
            'F'
            ,
            ''
            ,
            ''
            ,
            acpt.pid
        FROM
            ast.aeahacpt acpt
            ,
            ast.aebmeccd eccd
            ,
            ast.aerhrslt rslt
        WHERE
            acpt.execprcpstatcd IN ('730', '740')
          AND acpt.instcd = '052'
          AND acpt.prcpdd >= TO_CHAR(ADD_MONTHS(to_date(:inDate, 'YYYYMMDD'),-12), 'YYYYMMDD')
          AND acpt.actorddd = :inDate
          AND acpt.prcpdd >= TO_CHAR(ADD_MONTHS(to_date(:inDate, 'YYYYMMDD'),-12), 'YYYYMMDD')
          AND acpt.actorddd BETWEEN :inDate AND :outDate
          AND acpt.pid = :ptNo
          AND acpt.cretno = '2'
          AND eccd.instcd = acpt.instcd
          AND eccd.excucd = acpt.prcpcd
          AND eccd.suppdeptcd = acpt.suppdeptcd
          AND acpt.prcpdd BETWEEN eccd.excufromdd AND eccd.excutodd
          AND eccd.rsltdispgbn = 'F'
          AND acpt.rsltdd = rslt.rsltdd
          AND acpt.rsltno = rslt.rsltno
          AND acpt.suppdeptcd = rslt.suppdeptcd
          AND acpt.instcd = rslt.instcd
          AND rownum = 1
        UNION ALL
        SELECT
            ''
            ,
            ''
            ,
            'G'
            ,
            ''
            ,
            acpt.pid
        FROM
            ast.aeahacpt acpt
            ,
            ast.aebmeccd eccd
            ,
            ast.aerhrslt rslt
        WHERE
            acpt.execprcpstatcd IN ('730', '740')
          AND acpt.instcd = '052'
          AND acpt.prcpdd >= TO_CHAR(ADD_MONTHS(to_date(:inDate, 'YYYYMMDD'),-12), 'YYYYMMDD')
          AND acpt.actorddd = :inDate
          AND acpt.prcpdd >= TO_CHAR(ADD_MONTHS(to_date(:inDate, 'YYYYMMDD'),-12), 'YYYYMMDD')
          AND acpt.actorddd BETWEEN :inDate AND :outDate
          AND acpt.pid = :ptNo
          AND acpt.cretno = '2'
          AND eccd.instcd = acpt.instcd
          AND eccd.excucd = acpt.prcpcd
          AND eccd.suppdeptcd = acpt.suppdeptcd
          AND acpt.prcpdd BETWEEN eccd.excufromdd AND eccd.excutodd
          AND eccd.rsltdispgbn IN ('G', 'P')
          AND acpt.rsltdd = rslt.rsltdd
          AND acpt.rsltno = rslt.rsltno
          AND acpt.suppdeptcd = rslt.suppdeptcd
          AND acpt.instcd = rslt.instcd
          AND rownum = 1
        UNION ALL
        SELECT
            ''
            ,
            ''
            ,
            ''
            ,
            'H'
            ,
            acpt.pid
        FROM
            ast.aeahacpt acpt
            ,
            ast.aebmeccd eccd
            ,
            ast.aerhrslt rslt
        WHERE
            acpt.execprcpstatcd IN ('730', '740')
          AND acpt.instcd = '052'
          AND acpt.prcpdd >= TO_CHAR(ADD_MONTHS(to_date(:inDate, 'YYYYMMDD'),-12), 'YYYYMMDD')
          AND acpt.actorddd = :inDate
          AND acpt.prcpdd >= TO_CHAR(ADD_MONTHS(to_date(:inDate, 'YYYYMMDD'),-12), 'YYYYMMDD')
          AND acpt.actorddd BETWEEN :inDate AND :outDate
          AND acpt.pid = :ptNo
          AND acpt.cretno = '2'
          AND eccd.instcd = acpt.instcd
          AND eccd.excucd = acpt.prcpcd
          AND eccd.suppdeptcd = acpt.suppdeptcd
          AND acpt.prcpdd BETWEEN eccd.excufromdd AND eccd.excutodd
          AND eccd.rsltdispgbn = 'H'
          AND acpt.rsltdd = rslt.rsltdd
          AND acpt.rsltno = rslt.rsltno
          AND acpt.suppdeptcd = rslt.suppdeptcd
          AND acpt.instcd = rslt.instcd
          AND rownum = 1)
