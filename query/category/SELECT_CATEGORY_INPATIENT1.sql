SELECT
    MAX(decode(a, 'N', 'Y', 'N')) n,
    MAX(decode(b, 'M', 'Y', 'N')) m,
    MAX(decode(c, 'L', 'Y', 'N')) l,
    MAX(decode(d, 'P', 'Y', 'N')) p
FROM
    (
        SELECT decode(sbgd.testlrgcd, 'R', 'N', '') a ,
               decode(sbgd.testlrgcd, 'M', 'M', '') b ,
               decode(sbgd.testlrgcd, 'R', '', 'M', '', 'L') c ,
               '' d ,
               sbgd.pid
        FROM
            lis.llchsbgd sbgd,
            lis.llrhspdo spdo
        WHERE
            sbgd.instcd = '052'
          AND sbgd.pid = :ptNo
          AND sbgd.prcpdd BETWEEN :inDate AND :outDate
          AND PRCPGENRFLAG IN ( 'I' , 'D' , 'E')
          AND sbgd.orddd = :inDate
          AND sbgd.barcdprntdt >= (
            SELECT to_char(FSTRGSTDT, 'YYYYMMDDHH24MISS')
            FROM
                pam.pmcmptbs
            WHERE
                instcd = '052'
              AND pid = :ptNo)
          AND sbgd.spcstat = '4'
          AND spdo.pid = sbgd.pid
          AND spdo.instcd = sbgd.instcd
          AND spdo.bcno = sbgd.bcno
          AND spdo.tclscd = sbgd.tclscd
          AND spdo.spccd = sbgd.spccd
          AND spdo.spcacptdt = sbgd.spcacptdt
          AND spdo.rsltflag = 'O'
          AND spdo.rsltstat IN ('4', '5')
        UNION ALL
        SELECT '',
               '',
               '',
               'P',
               acpt.pid
        FROM
            lis.lpjmacpt acpt
            ,
            lis.lprmcnts cnts
        WHERE
            acpt.instcd = '052'
          AND acpt.pid = :ptNo
          AND acpt.prcpdd || '' BETWEEN :inDate AND :outDate
          AND acpt.orddd = :inDate
          AND acpt.instcd = cnts.instcd
          AND acpt.ptno = cnts.ptno
          AND acpt.acptstatcd IN ('3', '4')
          AND rownum = 1)
